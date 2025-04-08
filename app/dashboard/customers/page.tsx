import './styles.css'

export default function Promotions() {
    return (
        
        <div className="mainContainer">
            
            <section className="textpromo ">
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>NUEVA PROMO - DALE PLAY A TU CARNAVAL</h1>
            <div className="logoaj">
                    <img src="https://www.aj.gob.bo/images/logo_ajF.png" alt=""/>
                </div>
            </section>
            <section className="Promoinf" id="Flex">
                <div className="textoplay">
                    <h1 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>¡GANA!</h1>
                    <h3 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>CON <span>INDUSTRIAS CIN</span></h3>
                    <h4 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>UN INCREIBLE</h4>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/PlayStation_5_logo_and_wordmark.svg/2560px-PlayStation_5_logo_and_wordmark.svg.png"
                        alt=""/>
                </div>
                <div className="imagenplay">
                    <img src="/Play-station-5.png" alt=""/>
                </div>
            </section>
            <section className="pasos">
                <div className="text-descripcion">
                    <h1 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>¿CÓMO PUEDES GANAR tu play 5?</h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Sigue estos 3 simples pasos para participar del sorteo</p>
                </div>
                <div className="cuadros">
                    <div>
                        <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>PASO 1</h1>
                        <div className="pasos-cuadros-img-alig">
                            <img src="/etiquetas.png" alt=""/>
                        </div>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Junta 4 etiquetas de 3 Litros, entre nuestras 10 Sabores.</p>
                    </div>
                    <div>
                        <h1 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>PASO 2</h1>
                        <div className="pasos-cuadros-img-alig">
                            <img src="/Cupon play.gif" alt=""/>
                        </div>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Ve a los puntos autorizados para pedir tu cupón.</p>
                    </div>
                    <div>
                        <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>PASO 3</h1>
                        <div className="pasos-cuadros-img-alig">
                            <img src="/caja.png" alt=""/>
                        </div>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Y al Final deposita tu cupón en nuestros anforas autorizados.</p>
                    </div>
                </div>
            </section>
            <section className="fecha">
                <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>El sorteo y la entrega de premios llevara a acabo el 12 de Abril en Av. Andina, Esquina
                    Siwar</h1>
            </section>
            <section className="puntos">

            </section>
            <section className="mapa">
                <div className="mapa-texto">
                    <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>36 puntos</h1>
                    <h2 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>AUTORIZADOS</h2>
                    <h3 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Busca el más cercano <br/><span>DE TU ZONA</span></h3>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Tenemos anforas en la ciudad de Cochabamba, Centro, Sacaba, Quillacollo y mucho más. revisalo en
                        el siguiente mapa.</p>
                </div>
                <div className="map-section">
                    <h2 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Ubicación en el Mapa - Cochabamba, Bolivia</h2>
                    <div className="">
                        <iframe id="mapa-google"
                                src="https://www.google.com/maps/d/embed?mid=10tQ-4jCdRYy2wxeZXaGw6QOElB2s0OQ&ehbc=2E312F&noprof=1"></iframe>
                    </div>
                </div>
            </section>
            <section className="fecha">
                <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>HASTA EL 10 DE ABRIL TIENES PARA PONER TU CUPÓN EN NUESTRAS ANFORAS</h1>
            </section>

            <section className="jugopromo">
                <div className="jugopromo-texto">
                    <h1 id="textfon"style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Si quieres seguir tomando más jugo.</h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Si ya pusiste tu cupón, puedes seguir tomando nuestros jugos tradicionales de la presentación de
                        3 Litros.</p>
                </div>
                <div className="cuadro">
                    <div>
                        <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>JUNTA 5 ETIQUETAS</h1>
                        <img className="etiqueta" src="/5 etiquetas.png" alt=""/>
                    </div>
                    <div>
                        <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>aumenta 1 BS.</h1>
                        <img className="moneda" src="/1 bs.png" alt=""/>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}> ¡Y reclama un jugo de 3 Litros completamente GRATIS!</p>
                    </div>
                </div>
            </section>
            <section className="jugos">
                <div>
                    <h1 id="textfon" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>ESTOS SON NUESTROS 10 SABORES</h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}> Si te preguntaste cuales son los 10 sabores para reunir las etiquetas o los refrescos por los que
                        puedes cambiar, te los presento ahora mismo!</p>
                    <div className="img-center">
                        <img src="/BOTELLAS.png" alt=""/>
                    </div>
                </div>
            </section>

            <section className="action">
  <h1
    id="textfon"
    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
    className="m-0"
  >
    MIENTRAS MÁS CONSUMES
  </h1>
  <h2
    id="textfon"
    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
    className="m-0"
  >
    MÁS OPORTUNIDADES
  </h2>
  <h3
    id="textfon"
    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
    className="m-0"
  >
    TIENES DE GANAR
  </h3>
  
</section>

        </div>
        

    );
}