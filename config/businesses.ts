export interface BusinessGuide {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  color: string;
  group: string;
  aliases: string[];
  explanation: string;
  example: string;
  promotion: string;
  sale: string;
  steps: { title: string; description: string }[];
  tools: { name: string; description: string }[];
  reminders: string[];
  tutorials: string[];
  related: string[];
  source: string;
}

export const businessGuides: BusinessGuide[] = [
  {
    id: "dropshipping", name: "Dropshipping", subtitle: "Astra Vibe · Mascota Felix · Olzura", emoji: "📦", color: "#7252ac", group: "Astra Vibe", aliases: ["Astra Vibe", "Mascota Felix", "Olzura"],
    explanation: "Vendes productos desde una tienda en internet, pero no los guardas en casa. Cuando alguien compra, el proveedor envía el producto directamente al cliente. Tú llevas la tienda y atiendes al comprador.",
    example: "Piensa en una tienda sin almacén: tú muestras el producto y otra empresa prepara y envía el paquete. Lo que queda entre el precio de venta y los costes es tu ganancia.",
    promotion: "Redes sociales de cada marca", sale: "Tiendas de Shopify",
    steps: [
      { title: "Elegir qué vender", description: "Busca el producto y su proveedor en Dsers o Dropea. El proveedor es la empresa que tiene el producto y lo envía." },
      { title: "Preparar la tienda", description: "Las tres marcas ya tienen sus webs en Shopify, según el informe. Entra en la tienda de la marca con la que vas a trabajar." },
      { title: "Añadir el producto", description: "Importa el producto desde Dsers o Dropea. Revisa sus fotos, título, explicación y precio antes de ofrecerlo." },
      { title: "Dar a conocer la tienda", description: "Publica contenido en las redes de esa marca. El informe propone TikTok, Instagram, Facebook y YouTube; también contempla anuncios." },
      { title: "Recibir la compra", description: "El cliente elige el producto y paga en la tienda de Shopify." },
      { title: "Revisar el envío", description: "El informe describe el paso del pedido al proveedor mediante Dsers o Dropea. Comprueba que la conexión y el pedido funcionan; el proveedor envía el paquete." },
      { title: "Atender al cliente", description: "Responde dudas, sigue el envío y gestiona las devoluciones. Revisa lo que has cobrado y los costes del pedido." },
    ],
    tools: [{ name: "Shopify", description: "La tienda donde el cliente mira los productos y compra." }, { name: "Dsers", description: "Conecta productos, proveedores y pedidos con la tienda." }, { name: "Dropea", description: "Otra herramienta para trabajar con proveedores y pedidos." }],
    reminders: ["Trabaja con una marca cada vez: comprueba el nombre de la tienda y de la red social antes de publicar.", "Gabriel debe explicar y confirmar cómo están organizadas las tres marcas y la cuota de Shopify. El informe no detalla esa configuración."],
    tutorials: ["Cómo añadir un producto a Shopify", "Cómo revisar un pedido y su envío", "Cómo publicar en las redes de cada marca"], related: [], source: "Informe 1, página 1 · Informe 2, página 1",
  },
  {
    id: "bamzuk", name: "TikTok Shop de Bamzuk", subtitle: "Vídeos que pueden generar comisiones", emoji: "🛒", color: "#c75a22", group: "Bamzuk", aliases: ["Bamzuk"],
    explanation: "Muestras productos de TikTok Shop en tus vídeos. Si alguien compra usando el enlace del carrito de tu vídeo, puedes recibir una comisión. Según la guía, Daniel participa como afiliado: promociona productos de otros vendedores.",
    example: "Es como recomendar un producto a un amigo. Si lo compra desde tu enlace, la plataforma te paga una parte por haberlo recomendado.", promotion: "TikTok de Bamzuk + enlace del carrito", sale: "TikTok Shop",
    steps: [{ title: "Elegir un producto", description: "Elige un producto de TikTok Shop para mostrar en tus vídeos." }, { title: "Tenerlo a mano", description: "Pídelo, cómpralo o usa uno que ya tengas en casa. Necesitas poder mostrarlo y usarlo." }, { title: "Grabar el vídeo", description: "Enseña cómo es el producto y cómo se utiliza, con una explicación sencilla." }, { title: "Añadir el carrito", description: "Al publicar, añade el enlace del producto en el carrito de TikTok Shop. Ese enlace permite comprar desde el vídeo." }, { title: "Revisar las comisiones", description: "Cuando una compra se atribuye a tu enlace, TikTok Shop paga la comisión correspondiente. Revisa las ventas y comisiones en tu cuenta." }],
    tools: [{ name: "TikTok", description: "Aquí grabas o publicas los vídeos de Bamzuk." }, { name: "TikTok Shop", description: "Aquí se encuentran los productos, el escaparate y las comisiones." }, { name: "Pinterest", description: "El informe lo incluye como apoyo para llevar visitas a Bamzuk." }],
    reminders: ["La cuenta ya tiene seguidores y escaparates montados, según la guía.", "Kevin explicará cómo funciona TikTok Shop como afiliado. Un vídeo publicado debe llevar el enlace del producto para conectar con la compra."], tutorials: ["Cómo elegir un producto para promocionar", "Cómo poner el carrito en un vídeo", "Cómo consultar las comisiones"], related: [], source: "Informe 1, página 1 · Informe 2, página 3",
  },
  {
    id: "hotmart", name: "Ebook de pizza · Hotmart", subtitle: "Tu recetario, vendido por internet", emoji: "📖", color: "#ad573b", group: "Italy Pizza", aliases: ["Italy Pizza", "Hotmart"],
    explanation: "El ebook es un libro digital con recetas de pizza. Daniel lo vende como productor en Hotmart. La plataforma cobra al comprador, le entrega acceso al ebook y paga a Daniel después de descontar su comisión.",
    example: "El cliente compra un libro que recibe por internet. No hay que preparar un paquete: Hotmart entrega el acceso de forma automática.", promotion: "Redes de Italy Pizza, correos y mensajes", sale: "Hotmart",
    steps: [{ title: "Preparar el recetario", description: "El producto de Daniel es el ebook de recetas de pizza." }, { title: "Revisar su página de venta", description: "En Hotmart se añaden el ebook, su descripción, el precio y la página donde se ofrece." }, { title: "Encontrar el enlace de compra", description: "Hotmart genera el enlace que lleva al pago del ebook. Ese es el enlace que conecta la promoción con la compra." }, { title: "Atraer a los interesados", description: "Las redes de Italy Pizza dan a conocer el ebook. Systeme.io organiza la página de captación y los correos; ManyChat ayuda con los mensajes por chat." }, { title: "Recibir la venta", description: "El cliente paga en Hotmart y recibe acceso al ebook. La plataforma descuenta su comisión y paga el resto a Daniel." }, { title: "Revisar la atención y las devoluciones", description: "Si se solicita una devolución dentro de la garantía, Hotmart la gestiona según las condiciones del producto." }],
    tools: [{ name: "Hotmart", description: "Vende el ebook, cobra y entrega el acceso al comprador." }, { name: "Systeme", description: "Organiza la página de captación y los correos automáticos." }, { name: "ManyChat", description: "Automatiza conversaciones por chat para captar interesados." }],
    reminders: ["Productor significa que vendes tu propio producto; afiliado significa que recomiendas el de otra persona. En este ebook Daniel es productor.", "Gabriel explicará la conexión entre Systeme.io y ManyChat.", "La guía también explica la afiliación en Hotmart: elegir un producto, solicitar afiliación, compartir el enlace personal y recibir comisión por las compras atribuidas. También se puede abrir el ebook propio a afiliados."], tutorials: ["Cómo encontrar el enlace de compra del ebook", "Cómo funciona el recorrido de mensajes y correos", "Cómo revisar una venta en Hotmart"], related: ["italy"], source: "Informe 1, página 2 · Informe 2, página 2",
  },
  {
    id: "marketplaces", name: "Vinted y Wallapop", subtitle: "Las ventas de AprecioJusto", emoji: "🏷️", color: "#357d6c", group: "A Precio Justo", aliases: ["A Precio Justo", "AprecioJusto"],
    explanation: "Publicas artículos con fotos, una descripción y un precio. Los compradores los encuentran en Vinted o Wallapop y compran o te escriben. No necesitas una tienda propia para estos canales.",
    example: "Es como un escaparate compartido: pones tu anuncio junto a otros vendedores y atiendes a la persona interesada.", promotion: "Redes de AprecioJusto", sale: "Vinted y Wallapop",
    steps: [{ title: "Preparar el anuncio", description: "Haz fotos claras. Escribe qué es el artículo, su estado y su precio. En Wallapop elige también la categoría." }, { title: "Vender en Vinted", description: "El comprador paga en Vinted. La plataforma retiene el dinero mientras se completa la operación." }, { title: "Enviar con Vinted", description: "Prepara el paquete y utiliza la etiqueta de envío que genera Vinted. La guía indica que el pago se libera al monedero cuando se confirma la recepción correcta." }, { title: "Atender el chat de Wallapop", description: "Responde preguntas y acuerda el precio y la forma de entrega con el comprador." }, { title: "Entregar o enviar con Wallapop", description: "Puedes acordar entrega en mano o envío por la plataforma. El cobro depende de la modalidad y de la confirmación de recepción; revisa las condiciones y posibles comisiones." }, { title: "Conectar el anuncio con TikTok", description: "Los vídeos de AprecioJusto ayudan a que más personas conozcan los artículos y lleguen a sus anuncios." }],
    tools: [{ name: "Vinted", description: "Publica artículos y gestiona compras y envíos." }, { name: "Wallapop", description: "Publica anuncios, conversa con compradores y acuerda la entrega." }, { name: "TikTok", description: "Da a conocer los artículos de AprecioJusto." }],
    reminders: ["Las instrucciones resumen el informe. Antes de cerrar una venta, comprueba las condiciones que muestre la plataforma para esa operación."], tutorials: ["Cómo publicar un anuncio en Vinted", "Cómo preparar un envío", "Cómo responder y vender en Wallapop"], related: ["apreciojusto"], source: "Informe 1, página 2 · Informe 2, páginas 3–4",
  },
  {
    id: "apreciojusto", name: "TikTok de AprecioJusto", subtitle: "Dar a conocer tus artículos", emoji: "🎬", color: "#527c29", group: "A Precio Justo", aliases: ["A Precio Justo", "AprecioJusto"],
    explanation: "Es el canal de vídeos de AprecioJusto. Sirve para mostrar sus productos, ganar visibilidad y llevar a los interesados hacia los anuncios de Vinted y Wallapop.",
    example: "El vídeo es el escaparate que llama la atención. El anuncio de Vinted o Wallapop es el lugar donde se completa la venta.", promotion: "TikTok de AprecioJusto", sale: "Anuncios de Vinted y Wallapop",
    steps: [{ title: "Mostrar el artículo", description: "Graba un vídeo corto enseñando el producto de la marca." }, { title: "Publicar con una explicación", description: "Añade una descripción y etiquetas que ayuden a encontrarlo. Publica con regularidad." }, { title: "Dar a conocer la cuenta", description: "Los vídeos ayudan a que más personas vean los productos y sigan la cuenta." }, { title: "Llevar al anuncio", description: "Indica dónde encontrar el artículo en Vinted o Wallapop, para que el interesado pueda continuar la compra." }, { title: "Ver qué funciona", description: "Consulta las estadísticas de TikTok y repite los tipos de contenido que mejor resultado den." }],
    tools: [{ name: "TikTok", description: "Publica vídeos y consulta sus estadísticas." }, { name: "Vinted", description: "Uno de los destinos donde se venden los artículos." }, { name: "Wallapop", description: "El otro destino para los anuncios y las ventas." }], reminders: ["Kevin explicará la parte de TikTok. La función de este canal es promocionar los artículos de AprecioJusto."], tutorials: ["Cómo grabar y publicar un vídeo", "Cómo dirigir a un comprador al anuncio", "Cómo leer las estadísticas básicas"], related: ["marketplaces"], source: "Informe 1, página 2 · Informe 2, página 4",
  },
  {
    id: "italy", name: "Web de Italy Pizza", subtitle: "Tu negocio y tus redes, reunidos", emoji: "🍕", color: "#795244", group: "Italy Pizza", aliases: ["Italy Pizza"],
    explanation: "La web presenta Italy Pizza, muestra su oferta y ayuda a dar confianza a los clientes. Reúne sus redes: Instagram, TikTok, YouTube y Facebook. Las redes también ayudan a promocionar el ebook de pizza.",
    example: "La web es como la puerta de entrada del negocio: una persona llega, conoce Italy Pizza y encuentra cómo seguir viendo su contenido.", promotion: "Instagram, TikTok, YouTube y Facebook", sale: "Web de Italy Pizza · ebook en Hotmart",
    steps: [{ title: "Conocer la web", description: "Revisa qué muestra la página y cómo presenta la oferta de Italy Pizza." }, { title: "Encontrar las redes", description: "Comprueba los accesos a Instagram, TikTok, YouTube y Facebook." }, { title: "Publicar contenido", description: "Mantén las cuentas activas con vídeos y publicaciones que den a conocer el negocio." }, { title: "Conectar con el ebook", description: "La guía explica que las redes de Italy Pizza atraen interesados al ebook. Consulta la guía de Hotmart para entender cómo se completa esa venta." }],
    tools: [{ name: "Web", description: "Presenta la oferta de Italy Pizza y reúne sus redes." }, { name: "Instagram", description: "Una de las redes del negocio." }, { name: "TikTok", description: "Vídeos para dar a conocer el negocio." }, { name: "YouTube", description: "Otro canal para sus vídeos." }, { name: "Facebook", description: "Otra red para promocionar Italy Pizza." }], reminders: ["Los informes no detallan un proceso de compra dentro de la web. La guía de Hotmart explica por separado la venta del ebook.", "Kevin explicará TikTok; Gabriel y Kevin aportarán indicaciones para descargar y editar vídeos y elegir herramientas."], tutorials: ["Cómo entrar en la web y encontrar las redes", "Cómo publicar contenido de Italy Pizza", "Cómo conectar una publicación con el ebook"], related: ["hotmart"], source: "Informe 1, página 2 · Informe 2, páginas 4–5",
  },
];

export const supportingTools = [
  { name: "Correo e identidad", description: "Un correo por marca para registrarse y recibir avisos.", tools: "Gmail (A Precio Justo, Bamzuk, Bamzuk Ofertas, Daniel Longone e Italy Pizza), Outlook e iCloud." },
  { name: "Afiliación y marketplaces", description: "Plataformas de productos y programas que pueden pagar comisiones.", tools: "Awin, ClickBank, Digistore24, Temu Afiliados, Amazon y Miravia." },
  { name: "Cobros", description: "Payoneer recibe pagos internacionales. Sumup permite cobrar con tarjeta.", tools: "Payoneer y Sumup." },
  { name: "Webs y herramientas", description: "Hostinger aloja webs y dominios; Vercel publica webs; GitHub guarda el código; Turso y Upstash almacenan datos; IMGBB aloja imágenes; Improv MX reenvía correos.", tools: "También aparecen Systeme, Pinterest, Claude, Gemini e Higgsfield para ventas, contenido y ayuda con inteligencia artificial." },
];

export interface BusinessResource { name: string; platform: string; groupName: string; url: string; favorite: boolean; updatedAt: string }
export interface BusinessTutorial { id: string; businessId: string; title: string; url: string }
