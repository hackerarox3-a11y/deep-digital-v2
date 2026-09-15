"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { products } from "@/data/catalogue";
import { fabrics, fonts, sizes, studioColors } from "@/data/studio";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { buildCartWhatsAppUrl, buildWhatsAppUrl } from "@/services/quote-service";
import type { CartItem, StudioLayer, StudioState, StudioTool } from "@/types/studio";
import { clamp, cn, formatCfa } from "@/lib/utils";
import { GarmentSilhouette } from "@/components/garment-silhouette";

const defaultLayer: StudioLayer = { id: "signature", name: "Deep Digital", type: "text", content: "DEEP\nDIGITAL", x: 50, y: 48, scale: 1, rotation: 0, color: "#f7f6f2", font: "Suisse Int'l", visible: true };
const initialStudio: StudioState = { product: products[0], side: "front", color: "Noir Onyx", fabric: fabrics[0], size: "M", technique: "DTF Premium", zoom: 1, rotation: 0, showGrid: false, layers: [defaultLayer] };

const toolLabels: Array<[StudioTool, string]> = [["garment", "Vêt."], ["color", "Couleur"], ["compose", "Composer"], ["type", "Typo"], ["photos", "Photos"], ["price", "Prix"]];

export function Studio() {
  const [studio, setStudio, ready] = useLocalStorage<StudioState>("deep-digital-v2-studio", initialStudio);
  const [activeTool, setActiveTool] = useState<StudioTool>("garment");
  const [selectedLayerId, setSelectedLayerId] = useState(defaultLayer.id);
  const [history, setHistory] = useState<StudioState[]>([]);
  const [future, setFuture] = useState<StudioState[]>([]);
  const [before, setBefore] = useState(false);
  const [toast, setToast] = useState("");
  const [cart, setCart, cartReady] = useLocalStorage<CartItem[]>("deep-digital-v2-cart", []);
  const dragging = useRef<string | null>(null);

  const selectedLayer = studio.layers.find((layer) => layer.id === selectedLayerId);
  const colorValue = studioColors.find((color) => color.name === studio.color)?.value ?? "#101114";
  const price = studio.product.price + (studio.technique === "Broderie" ? 3000 : 0);
  const studioLabel = useMemo(() => `${studio.product.name} · ${studio.color} · ${studio.size} · ${studio.technique}`, [studio]);

  useEffect(() => {
    if (!ready) return;
    const selectModelFromHash = () => {
      const modelId = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("model");
      const selectedProduct = products.find((product) => product.id === modelId);
      if (selectedProduct) setStudio((current) => current.product.id === selectedProduct.id ? current : { ...current, product: selectedProduct });
    };
    selectModelFromHash();
    window.addEventListener("hashchange", selectModelFromHash);
    return () => window.removeEventListener("hashchange", selectModelFromHash);
  }, [ready, setStudio]);

  function commit(next: StudioState) {
    setHistory((items) => [...items.slice(-14), studio]);
    setFuture([]);
    setStudio(next);
  }
  function patch(partial: Partial<StudioState>) { commit({ ...studio, ...partial }); }
  function undo() { const previous = history.at(-1); if (!previous) return; setFuture((items) => [studio, ...items]); setHistory((items) => items.slice(0, -1)); setStudio(previous); }
  function redo() { const next = future[0]; if (!next) return; setHistory((items) => [...items, studio]); setFuture((items) => items.slice(1)); setStudio(next); }
  function updateLayer(id: string, partial: Partial<StudioLayer>, save = true) {
    const next = { ...studio, layers: studio.layers.map((layer) => layer.id === id ? { ...layer, ...partial } : layer) };
    if (save) commit(next); else setStudio(next);
  }
  function addText() {
    const layer: StudioLayer = { id: crypto.randomUUID(), name: "Nouveau texte", type: "text", content: "VOTRE TEXTE", x: 50, y: 58, scale: 0.72, rotation: 0, color: "#f7f6f2", font: fonts[0], visible: true };
    commit({ ...studio, layers: [...studio.layers, layer] }); setSelectedLayerId(layer.id);
  }
  function adjustSelected(partial: Partial<StudioLayer>) {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, partial);
  }
  function centerSelected() {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, { x: 50, y: 50, rotation: 0 });
  }
  function duplicate() { if (!selectedLayer) return; const copy = { ...selectedLayer, id: crypto.randomUUID(), name: `${selectedLayer.name} copie`, x: clamp(selectedLayer.x + 5, 5, 95), y: clamp(selectedLayer.y + 5, 5, 95) }; commit({ ...studio, layers: [...studio.layers, copy] }); setSelectedLayerId(copy.id); }
  function remove() { if (!selectedLayer || studio.layers.length === 1) return; commit({ ...studio, layers: studio.layers.filter((layer) => layer.id !== selectedLayer.id) }); setSelectedLayerId(studio.layers.find((layer) => layer.id !== selectedLayer.id)?.id ?? ""); }
  function uploadImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxDimension = 1200;
        const ratio = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const context = canvas.getContext("2d");
        if (!context) { notify("Impossible de préparer cette image"); return; }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const content = canvas.toDataURL("image/webp", 0.82);
        const layer: StudioLayer = { id: crypto.randomUUID(), name: file.name, type: "image", content, x: 50, y: 50, scale: 0.82, rotation: 0, visible: true };
        try {
          setStudio((current) => ({ ...current, layers: [...current.layers, layer] }));
          setSelectedLayerId(layer.id);
          notify("Image ajoutée au Studio");
        } catch {
          notify("Image trop lourde pour le brouillon local");
        }
      };
      image.onerror = () => notify("Format d'image non reconnu");
      image.src = String(reader.result);
    };
    reader.onerror = () => notify("Lecture de l'image impossible");
    reader.readAsDataURL(file);
  }
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2200); }
  function addToCart() {
    const existing = cart.find((item) => item.state.product.id === studio.product.id && item.state.color === studio.color && item.state.size === studio.size && item.state.technique === studio.technique);
    setCart(existing ? cart.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { state: { ...studio, product: { ...studio.product, price } }, quantity: 1 }]);
    notify("Modèle ajouté au panier");
  }
  function removeFromCart(index: number) { setCart(cart.filter((_, itemIndex) => itemIndex !== index)); }
  function moveLayer(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = clamp(((event.clientX - rect.left) / rect.width) * 100, 10, 90);
    const rawY = clamp(((event.clientY - rect.top) / rect.height) * 100, 10, 90);
    // Smart guides snap artwork to the centre or nearby 10% columns.
    const snap = (value: number) => [20, 30, 40, 50, 60, 70, 80].reduce((best, guide) => Math.abs(value - guide) < Math.abs(value - best) ? guide : best, value);
    updateLayer(dragging.current, { x: Math.abs(rawX - snap(rawX)) < 2.2 ? snap(rawX) : rawX, y: Math.abs(rawY - snap(rawY)) < 2.2 ? snap(rawY) : rawY }, false);
  }
  function finishMove() { if (dragging.current) { dragging.current = null; setHistory((items) => [...items.slice(-14), studio]); } }
  function exportDesign(kind: "PNG" | "PDF") {
    const canvas = document.createElement("canvas"); canvas.width = 1600; canvas.height = 1800;
    const context = canvas.getContext("2d"); if (!context) return;
    context.fillStyle = "#f5f4f1"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = colorValue; context.fillRect(300, 160, 1000, 1300);
    context.fillStyle = "#0b0b0c"; context.font = "600 48px Arial"; context.fillText("DEEP DIGITAL — MAQUETTE", 90, 90);
    context.font = "30px Arial"; context.fillText(studioLabel, 90, 1700);
    studio.layers.filter((layer) => layer.type === "text" && layer.visible).forEach((layer) => {
      context.save(); context.translate(layer.x * 16, layer.y * 14); context.rotate((layer.rotation * Math.PI) / 180); context.fillStyle = layer.color ?? "#f7f6f2"; context.font = `${Math.round(56 * layer.scale)}px Arial`; layer.content.split("\n").forEach((line, index) => context.fillText(line, 0, index * 60)); context.restore();
    });
    if (kind === "PNG") { const link = document.createElement("a"); link.download = "deep-digital-maquette.png"; link.href = canvas.toDataURL("image/png"); link.click(); }
    else { const printable = window.open("", "_blank"); if (printable) { printable.document.write(`<img alt="Maquette Deep Digital" src="${canvas.toDataURL("image/png")}" style="width:100%" />`); printable.document.close(); printable.print(); } }
    notify(`Export ${kind} prêt`);
  }

  return (
    <section id="studio" className="studio section-shell">
      <div className="studio__intro"><p className="eyebrow">Digital Customization Engine</p><h2 className="section-heading">Configurez votre vêtement personnalisé</h2><p className="section-description">Notre studio virtuel vous permet de personnaliser instantanément votre vêtement haut de gamme avec vos propres photos, motifs ou textes, le tout avec un aperçu réel en temps réel.</p></div>
      <div className="studio__shell">
        <aside className="studio-controls" aria-label="Outils du Studio">
          <div className="tool-tabs" role="tablist" aria-label="Étapes de personnalisation">{toolLabels.map(([tool, label], index) => <button key={tool} type="button" role="tab" aria-selected={activeTool === tool} className={cn(activeTool === tool && "is-active")} onClick={() => setActiveTool(tool)}><span>{label}</span><small>0{index + 1}</small></button>)}</div>
          <div className="tool-progress" aria-hidden="true"><span style={{ width: `${((toolLabels.findIndex(([tool]) => tool === activeTool) + 1) / toolLabels.length) * 100}%` }} /></div>
          <div className="tool-panel">
            <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
            {activeTool === "garment" && <><h3>Quel support pour votre projet ?</h3><p>Tous nos textiles sont bio et certifiés équitables.</p>{products.map((product) => <button type="button" key={product.id} onClick={() => patch({ product, fabric: product.name === "Hoodies" ? fabrics[1] : product.name === "Tote Bags" ? fabrics[2] : fabrics[0],  technique: product.technique.includes("Broderie")
      ? "Broderie"
      : "DTF Premium",
  })
} className={cn("option-row", studio.product.id === product.id && "is-selected")}><span>{product.name.replace("s", "")}</span><strong>dès {formatCfa(product.price).replace(" CFA", "")}</strong></button>)}</>}
            {activeTool === "compose" && <><h3>Composer le visuel</h3><p>Assemblez vos photos et textes, puis placez-les directement sur le T-shirt.</p><div className="compose-actions"><button type="button" className="button button--light button--small" onClick={addText}>Ajouter du texte +</button><label className="button button--ghost button--small">Ajouter des images +<input type="file" accept="image/*" multiple onChange={(event) => { Array.from(event.target.files ?? []).forEach((file) => uploadImage(file)); event.currentTarget.value = ""; }} /></label></div>{selectedLayer && <div className="compose-controls"><strong>Calque sélectionné</strong><span>{selectedLayer.name}</span><div className="compose-control-row"><button type="button" onClick={() => adjustSelected({ scale: clamp(selectedLayer.scale - .08, .2, 2) })}>Taille −</button><button type="button" onClick={() => adjustSelected({ scale: clamp(selectedLayer.scale + .08, .2, 2) })}>Taille +</button><button type="button" onClick={() => adjustSelected({ rotation: selectedLayer.rotation - 15 })}>↶</button><button type="button" onClick={() => adjustSelected({ rotation: selectedLayer.rotation + 15 })}>↷</button></div><button type="button" className="option-row" onClick={centerSelected}>Centrer le calque <strong>50 / 50</strong></button></div>}<div className="compose-library"><strong>Bibliothèque · {studio.layers.length} calque(s)</strong>{studio.layers.map((layer) => <button type="button" key={layer.id} className={cn("compose-layer", selectedLayerId === layer.id && "is-selected")} onClick={() => setSelectedLayerId(layer.id)}>{layer.type === "image" ? <img src={layer.content} alt="" /> : <span className="compose-layer__text">T</span>}<span>{layer.name}</span><small>{layer.visible ? "Visible" : "Masqué"}</small></button>)}</div></>}
            {activeTool === "color" && <><h3>Couleur &amp; tissu</h3><div className="swatches">{studioColors.map((color) => <button type="button" key={color.name} aria-label={color.name} title={color.name} onClick={() => patch({ color: color.name })} className={cn("swatch", studio.color === color.name && "is-selected")} style={{ backgroundColor: color.value }} />)}</div><label className="field-label">Tissu<select value={studio.fabric} onChange={(event) => patch({ fabric: event.target.value })}>{fabrics.map((fabric) => <option key={fabric}>{fabric}</option>)}</select></label></>}
            {activeTool === "type" && <><h3>Typographie &amp; calques</h3><button type="button" className="button button--light button--small" onClick={addText}>Ajouter un texte +</button>{selectedLayer?.type === "text" && <><label className="field-label">Texte<textarea value={selectedLayer.content} onChange={(event) => updateLayer(selectedLayer.id, { content: event.target.value })} /></label><label className="field-label">Police<select value={selectedLayer.font} onChange={(event) => updateLayer(selectedLayer.id, { font: event.target.value })}>{fonts.map((font) => <option key={font}>{font}</option>)}</select></label></>}{studio.layers.map((layer) => <button type="button" key={layer.id} className={cn("layer-row", selectedLayerId === layer.id && "is-selected")} onClick={() => setSelectedLayerId(layer.id)}><span>{layer.type === "image" ? "▧" : "T"}</span>{layer.name}<small>{layer.visible ? "●" : "○"}</small></button>)}</>}
            {activeTool === "photos" && <><h3>Photos inspiration</h3><p>Ajoutez votre logo, votre photo principale ou une inspiration. Votre fichier reste dans votre navigateur.</p><label className="upload-zone"><input type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} /><span>Déposer une image<br /><small>PNG, JPG ou WEBP</small></span></label></>}
            {activeTool === "price" && <><h3>Estimation</h3><p>Choisissez la taille et la technique de production.</p><label className="field-label">Technique<select value={studio.technique} onChange={(event) => patch({ technique: event.target.value })}><option>DTF Premium</option><option>Sérigraphie</option><option>Broderie</option><option>Impression Numérique</option></select></label><div className="estimate"><span>Devis global estimé</span><strong>{formatCfa(price)}</strong><small>HT</small></div></>}
            </motion.div>
          </div>
        </aside>
        <div className="studio-preview">
          <div className="preview-topbar"><div className="segmented"><button type="button" className={cn(studio.side === "front" && "is-active")} onClick={() => patch({ side: "front" })}>Recto</button><button type="button" className={cn(studio.side === "back" && "is-active")} onClick={() => patch({ side: "back" })}>Verso</button></div><span>{ready ? "Brouillon sauvegardé" : "Chargement du Studio"}</span></div>
          <div className={cn("studio-stage", studio.showGrid && "studio-stage--grid")} onPointerMove={moveLayer} onPointerUp={finishMove} onPointerLeave={finishMove}>
            <span className="guide guide--horizontal" /><span className="guide guide--vertical" />
            <motion.div animate={{ scale: studio.zoom, rotateY: studio.rotation }} transition={{ type: "spring", stiffness: 180, damping: 20 }} className="garment-preview">
              {studio.product.kind === "tshirt" ? <img className="studio-mockup" src={`/mockups/tshirt-${studio.side}.png`} alt={`Mockup T-shirt ${studio.side === "front" ? "recto" : "verso"}`} /> : <GarmentSilhouette product={studio.product.kind} color={colorValue} label={`${studio.product.name} ${studio.side === "front" ? "recto" : "verso"}`} />}
              {!before && studio.layers.filter((layer) => layer.visible).map((layer) => <button key={layer.id} type="button" className={cn("design-layer", selectedLayerId === layer.id && "is-selected")} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragging.current = layer.id; setSelectedLayerId(layer.id); }} style={{ left: `${layer.x}%`, top: `${layer.y}%`, transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`, color: layer.color, fontFamily: layer.font }} aria-label={`Calque ${layer.name}`}>{layer.type === "image" ? <img src={layer.content} alt="Élément importé" /> : layer.content.split("\n").map((line) => <span key={line}>{line}</span>)}</button>)}
            </motion.div>
          </div>
          <div className="preview-actions"><div><button type="button" onClick={() => patch({ zoom: clamp(studio.zoom - .1, .7, 1.35) })}>−</button><span>Zoom {Math.round(studio.zoom * 100)}%</span><button type="button" onClick={() => patch({ zoom: clamp(studio.zoom + .1, .7, 1.35) })}>+</button></div><div><button type="button" onClick={() => patch({ rotation: studio.rotation - 45 })}>↶ 360°</button><button type="button" className={cn(before && "is-active")} onClick={() => setBefore(!before)}>Avant / Après</button><button type="button" className={cn(studio.showGrid && "is-active")} onClick={() => patch({ showGrid: !studio.showGrid })}>Grille</button></div></div>
          <div className="layer-actions"><button type="button" onClick={undo} disabled={!history.length}>↶ Historique</button><button type="button" onClick={redo} disabled={!future.length}>↷ Rétablir</button><button type="button" onClick={duplicate} disabled={!selectedLayer}>Dupliquer</button><button type="button" onClick={remove} disabled={!selectedLayer || studio.layers.length === 1}>Supprimer</button><button type="button" onClick={() => exportDesign("PNG")}>Export PNG</button><button type="button" onClick={() => exportDesign("PDF")}>Export PDF</button></div>
          <div className="studio-order"><div><p>Aperçu technique</p><span>Technique : {studio.technique}</span><small>Fidélité Réelle 99%</small></div><div className="sizes"><span>Taille</span>{sizes.map((size) => <button type="button" className={cn(studio.size === size && "is-active")} onClick={() => patch({ size })} key={size}>{size}</button>)}</div><p>Pas sûr de votre taille ? Notre atelier vous conseille gratuitement après votre commande.</p><div className="studio-order__actions"><button type="button" className="button button--light" onClick={addToCart}>Ajouter au panier <span aria-hidden>+</span></button><a className="button button--ghost studio-order__whatsapp" href={buildWhatsAppUrl({ ...studio, product: { ...studio.product, price } })} target="_blank" rel="noreferrer">WhatsApp direct <span aria-hidden>↗</span></a></div><small>*Aucun paiement requis en ligne. Ajoutez plusieurs modèles au panier, puis envoyez toute la sélection à l&apos;atelier.</small></div>
          {cartReady && <div className="studio-cart"><div className="studio-cart__heading"><strong>Panier · {cart.reduce((total, item) => total + item.quantity, 0)} article(s)</strong><a className="button button--small button--light" href={cart.length ? buildCartWhatsAppUrl(cart) : undefined} target="_blank" rel="noreferrer" aria-disabled={!cart.length}>Envoyer le panier ↗</a></div>{cart.length ? cart.map((item, index) => <div className="studio-cart__item" key={`${item.state.product.id}-${index}`}><span>{item.quantity} × {item.state.product.name}</span><small>{formatCfa(item.state.product.price * item.quantity)}</small><button type="button" onClick={() => removeFromCart(index)} aria-label={`Retirer ${item.state.product.name}`}>×</button></div>) : <p>Votre panier est vide. Configurez un modèle pour commencer.</p>}</div>}
        </div>
      </div>
      <AnimatePresence>{toast && <motion.div role="status" className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>{toast}</motion.div>}</AnimatePresence>
    </section>
  );
}
