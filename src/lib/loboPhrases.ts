import { LoboMood } from './types';

export interface LoboPhrase {
  quote: string;
  subtext?: string;
  tag?: string;
}

export const MOOD_PHRASES: Record<LoboMood, LoboPhrase[]> = {
  sunny: [
    {
      quote: "¡Buenos días, Corazoncillo! Qué día tan radiante en Juárez para sonreír.",
      subtext: "Lobo ya se estiró y movió la colita 🐾",
      tag: "Día soleado",
    },
    {
      quote: "Amorcillo, el cielo está despejadito y precioso... ¡igual que tú hoy!",
      subtext: "Lobo aprueba un paseo tempranero en Campestre Senecú",
      tag: "Clima perfecto",
    },
    {
      quote: "¡Corazoncillo! Amorcillo me pidió que te recordara que tengas un día increíble.",
      subtext: "Y que tomes agua para mantenerte fresca",
      tag: "Mensaje de amor",
    },
    {
      quote: "Amorcillo, mira qué solecito tan rico... me dieron ganas de atrapar mariposas.",
      subtext: "Lobo correteando en círculos feliz",
      tag: "Energía perruna",
    },
    {
      quote: "¡Corazoncillo! Ya me puse mis lentes de sol, ¿a poco no me veo bien galán?",
      subtext: "Lobo posando como modelo de revista",
      tag: "Estilo Lobo",
    },
    {
      quote: "Amorcillo, hoy el sol de Juárez brilla con ganas. ¡Acuérdate de tu protector solar!",
      subtext: "Lobo preocupado por el cutis de Corazoncillo",
      tag: "Consejo de belleza",
    },
    {
      quote: "Corazoncillo, día perfecto para salir por una nieve y caminar con amorcillo.",
      subtext: "Lobo exige probar una probadita de vainilla",
      tag: "Plan del día",
    },
    {
      quote: "¡Amorcillo! La vitamina D anda al 100%, pero la mejor vitamina eres tú.",
      subtext: "Lobo filosofando en el pastito",
      tag: "Ternura total",
    },
    {
      quote: "Corazoncillo, ¿jugamos a lanzar la pelota? Yo prometo devolvértela... tal vez 🎾",
      subtext: "Lobo con la pelota bien apretada en el hocico",
      tag: "Hora de jugar",
    },
  ],

  heat: [
    {
      quote: "¡Amorcillo, auxilio! Juárez parece un comal encendido... ¡me estoy derritiendo!",
      subtext: "Lobo está en modo alfombra pegado al cooler 🥵🧊",
      tag: "Calor desértico",
    },
    {
      quote: "Corazoncillo, no salgas al sol sin tu agüita fría. Lobo dice que el asfalto quema las patitas.",
      subtext: "Mejor quédate en el aire acondicionado viendo series con amorcillo",
      tag: "Alerta de calor",
    },
    {
      quote: "Amorcillo, hoy Juárez está a más de 90°F. ¡Si sales te vas a derretir como paleta en la 16!",
      subtext: "Lobo exige cubitos de hielo en su platito",
      tag: "Modo horno",
    },
    {
      quote: "¡Corazoncillo, ya me metí a la alberquita con mi patito salvavidas! ¡Vénganse al agua!",
      subtext: "Lobo salpicando agua fresca por todos lados",
      tag: "Albercada en casa",
    },
    {
      quote: "Amorcillo, me puse una bolsa de hielos en la cabeza... mi cerebro de Alaskan no aguanta tanto calor.",
      subtext: "Lobo comiendo sandía helada para no evaporarse",
      tag: "Lobo con hielito",
    },
    {
      quote: "Corazoncillo, decreto oficial: hoy nadie cocina, hace demasiado calor. ¡Que amorcillo invite la comida!",
      subtext: "Lobo buscando el lugar más frío de la casa",
      tag: "Decreto canino",
    },
    {
      quote: "Amorcillo, el piso de mosaico frío es mi nuevo mejor amigo hoy.",
      subtext: "Lobo con las 4 patas estiradas como rana",
      tag: "Modo sploot",
    },
    {
      quote: "Corazoncillo, ¿quién inventó el calor en el desierto? Yo tengo abrigo natural de 3 capas 😭",
      subtext: "Lobo suspirando frente al abanico",
      tag: "Drama de Alaskan",
    },
    {
      quote: "Amorcillo, si prenden el mini-split no me despego de ahí en todo el día.",
      subtext: "Lobo guardián del aire frío",
      tag: "Team aire acondicionado",
    },
  ],

  thunderstorm: [
    {
      quote: "Corazoncillo... no me gustan los truenos 🥺⚡ ¿Me das un abrazo de rescate?",
      subtext: "Lobo está temblando debajo de la cobija abrazando a su osito",
      tag: "Miedo a los truenos",
    },
    {
      quote: "¡Amorcillo! Hay relámpagos bien feos afuera... Dile a amorcillo que me proteja.",
      subtext: "Lobo escondido con ojitos de apapacho 🐾",
      tag: "Tormenta en Juárez",
    },
    {
      quote: "Corazoncillo, la lluvia suena muy fuerte... ¿puedo acostarme pegadito a tus pies hoy?",
      subtext: "Lobo promete no ocupar toda la cama",
      tag: "Buscando cobijo",
    },
    {
      quote: "¡Amorcillo, ya me metí debajo de la mesa de la sala! Aquí no me alcanzan los rayos.",
      subtext: "Solo se le ve el hocico y sus ojitos cafés preocupados",
      tag: "Refugio seguro",
    },
    {
      quote: "Corazoncillo, me puse mis audífonos esponjosos con música relajante... ¡abrázame fuerte!",
      subtext: "Lobo apretando un cojín de corazón",
      tag: "Música anti-truenos",
    },
    {
      quote: "Amorcillo, ¿el cielo se cayó o por qué truena tan recio? ¡Tápame las orejitas!",
      subtext: "Lobo escondiendo la cabeza bajo tu brazo",
      tag: "Protección canina",
    },
    {
      quote: "Corazoncillo, dile a las nubes que ya dejen de hacer ruido que no dejan dormir a mi amorcillo.",
      subtext: "Lobo rezongando bajito con un gruñido tierno",
      tag: "Guardián asustado",
    },
    {
      quote: "¡Amorcillo! Un relámpago iluminó toda la casa... ¡menos mal que tú estás aquí para calmarme!",
      subtext: "Lobo suspirando aliviado cuando lo acaricias",
      tag: "Paz en la tormenta",
    },
    {
      quote: "Corazoncillo, si me das un premio de cremita o galleta se me quita el miedo al instante 🍪",
      subtext: "Lobo aplicando chantaje emocional por la tormenta",
      tag: "Estrategia de Lobo",
    },
  ],

  winter: [
    {
      quote: "¡CORAZONCILLO! ¡ESTE ES MI CLIMA FAVORITO! ❄️✨ ¡Por fin puedo respirar!",
      subtext: "Lobo corriendo feliz con su bufandita roja",
      tag: "Paraíso ártico",
    },
    {
      quote: "Amorcillo, salgamos a jugar al frío... ¡pero a ti sí te hace falta chamarra bien gruesa!",
      subtext: "Lobo te presta su calor de Alaskan",
      tag: "Día helado",
    },
    {
      quote: "¡Corazoncillo, hace frío rico! Día perfecto para un chocolatito caliente con amorcillo.",
      subtext: "Lobo se echa feliz en el piso helado",
      tag: "Felicidad invernal",
    },
    {
      quote: "¡Amorcillo! ¡Hice un muñeco de nieve con forma de perrito y nariz de zanahoria!",
      subtext: "Lobo con su gorrito azul de estambre presumido",
      tag: "Arte de nieve",
    },
    {
      quote: "Corazoncillo, mira cómo me resbalo de pancita en la nieve como pingüino 🐧❄️",
      subtext: "Lobo patinando feliz con una sonrisa de oreja a oreja",
      tag: "Tobogán de Lobo",
    },
    {
      quote: "Amorcillo, Juárez amaneció bien frío, ¡pero mi corazón por ti está bien calientito!",
      subtext: "Lobo sacudiéndose los copos de nieve del lomo",
      tag: "Frío afuera, amor adentro",
    },
    {
      quote: "¡Corazoncillo! Ni se te ocurra ponerme suéter a mí, yo traigo mi abrigo de fábrica.",
      subtext: "Lobo orgulloso de su melena esponjada",
      tag: "Alaskan auténtico",
    },
    {
      quote: "Amorcillo, hora de acurrucarse en el sillón con cobija de tigre y ver películas con amorcillo.",
      subtext: "Lobo haciéndose bolita a los pies",
      tag: "Tarde de películas",
    },
    {
      quote: "Corazoncillo, ¡el vapor sale por mi hocico como si fuera un dragón de hielo!",
      subtext: "Lobo jugando a echar humo por la boca",
      tag: "Dragón ártico",
    },
  ],

  windy: [
    {
      quote: "¡Amorcillo, agárrate que el viento de Juárez anda bravísimo hoy! 💨",
      subtext: "Lobo ya se puso sus goggles tácticos para las tolvaneras",
      tag: "Tolvanera juarense",
    },
    {
      quote: "Corazoncillo, cuídate los ojitos de la tierra. Mi melena ondea como capa de superhéroe.",
      subtext: "Lobo enfrentando las ráfagas con valentía",
      tag: "Viento del desierto",
    },
    {
      quote: "¡Amorcillo, van volando ramas y botes de basura! Camina con cuidado hoy.",
      subtext: "Lobo vigila desde la ventana firme como guardián",
      tag: "Alerta de ráfagas",
    },
    {
      quote: "¡Corazoncillo, saqué mi papalote de colores a volar en el viento!",
      subtext: "El papalote vuela altísimo sobre el desierto",
      tag: "Volando papalote",
    },
    {
      quote: "Amorcillo, me subí al cerrito a vigilar la ciudad... ¡me siento como el rey de Juárez!",
      subtext: "Lobo con su melena al viento mirando el horizonte",
      tag: "Lobo guardián",
    },
    {
      quote: "Corazoncillo, no te hagas peinados difíciles hoy porque el viento de Juárez no perdona 🌪️",
      subtext: "Lobo despeinado pero con mucho porte",
      tag: "Consejo de estilista",
    },
    {
      quote: "¡Amorcillo! Vi rodar una bola de pasto seco rodadora de película de vaqueros.",
      subtext: "Lobo listo para un duelo vaquero",
      tag: "Clásico de Juárez",
    },
    {
      quote: "Corazoncillo, cierra bien las ventanas para que no se meta la tierra a la casa.",
      subtext: "Lobo ayudando a empujar las cortinas",
      tag: "Cero polvareda",
    },
    {
      quote: "Amorcillo, el viento aúlla fuerte, pero yo aúllo más bonito: ¡AUUUUUUU! 🐺",
      subtext: "Lobo afinando la garganta",
      tag: "Aullido de amor",
    },
  ],

  rain: [
    {
      quote: "Corazoncillo, mira qué rico huele a tierra mojada en Juárez. ¡Huele a petricor!",
      subtext: "Lobo ya estrenó su impermeable amarillo con patito",
      tag: "Lluvia fresca",
    },
    {
      quote: "Amorcillo, día lluvioso y relajante... perfecto para ver una película abrazada de amorcillo.",
      subtext: "Lobo mirando las gotitas correr por la ventana ☕",
      tag: "Tarde lluviosa",
    },
    {
      quote: "Corazoncillo, no olvides tu paraguas si tienes que salir. ¡No te vayas a mojar!",
      subtext: "Lobo chapoteando con sus botitas amarillas",
      tag: "Cuidado con los charcos",
    },
    {
      quote: "¡Amorcillo! Ya me puse mis botas amarillas de lluvia y salté en el charco más grande.",
      subtext: "Lobo feliz dejando huellitas de agua",
      tag: "Chapoteadero",
    },
    {
      quote: "Corazoncillo, estoy envuelto como burrito en una cobija tejida tomando chocolate caliente.",
      subtext: "Lobo relajándose junto al café de Corazoncillo",
      tag: "Modo burrito",
    },
    {
      quote: "Amorcillo, la lluvia en Juárez es un milagro del cielo, ¡qué día tan bendecido y fresco!",
      subtext: "Lobo oliendo el aire húmedo con alegría",
      tag: "Bendición del desierto",
    },
    {
      quote: "Corazoncillo, ¿me secas con la toalla si me mojo? Me encanta cuando me tallas la cabeza.",
      subtext: "Lobo meneando la cola esperando la toalla",
      tag: "Hora de secarse",
    },
    {
      quote: "Amorcillo, no manejes rápido en los encharcamientos de la Tecnológico o la Gómez Morín 🚗🌧️",
      subtext: "Lobo dando consejos viales de Ciudad Juárez",
      tag: "Precaución vial",
    },
    {
      quote: "Corazoncillo, el sonidito de las gotas golpeando el techo me da un sueño bien rico...",
      subtext: "Lobo con los ojos chiquitos cabeceando",
      tag: "Lluvia para dormir",
    },
  ],

  sunset: [
    {
      quote: "Mira qué atardecer tan hermoso en Juárez, Amorcillo... casi tan bonito como tú 🌅❤️",
      subtext: "El cielo se pintó de rosas y violetas",
      tag: "Atardecer juarense",
    },
    {
      quote: "Corazoncillo, llegó la hora mágica. Amorcillo me encargó mandarte un beso bien grandote.",
      subtext: "Lobo contemplando el horizonte en calma",
      tag: "Hora dorada",
    },
    {
      quote: "Amorcillo, el día ya va terminando. Gracias por ser tan linda conmigo y con amorcillo.",
      subtext: "Lobo suspira contento",
      tag: "Paz en la tarde",
    },
    {
      quote: "¡Corazoncillo! Me eché en el porche a ver cómo se prenden las lucecitas de Juárez y El Paso.",
      subtext: "Lobo viendo la frontera iluminarse en la noche",
      tag: "Luces de la frontera",
    },
    {
      quote: "Amorcillo, me senté en la banquita del parque a ver la bola de fuego dorada esconderse.",
      subtext: "La famosa X de Juárez brillando al fondo",
      tag: "La X de Juárez",
    },
    {
      quote: "Corazoncillo, ¿sabías que los atardeceres de Juárez son los más bonitos del mundo? Porque los ves tú.",
      subtext: "Lobo todo poético y cariñoso",
      tag: "Poesía de Lobo",
    },
    {
      quote: "Amorcillo, hora de guardar las preocupaciones y disfrutar de la tardecita en paz.",
      subtext: "Lobo recostando su cabezota en tus piernas",
      tag: "Hora de relajarse",
    },
    {
      quote: "Corazoncillo, el cielo parece algodón de azúcar rosa y uva... ¡se ve riquísimo!",
      subtext: "Lobo lamiéndose los bigotes",
      tag: "Cielo de algodón",
    },
    {
      quote: "¡Amorcillo! Si estuviera en el mirador de la Biblia aullaría una serenata para ti y amorcillo.",
      subtext: "Lobo soñando con ser cantante de mariachi",
      tag: "Serenata juarense",
    },
  ],

  night: [
    {
      quote: "Buenas noches, Corazoncillo. Ya me enrollé en mi rosquita para dormir 🌙💤",
      subtext: "Lobo roncando suavecito bajo las estrellas",
      tag: "Hora de dormir",
    },
    {
      quote: "Descansa mucho, Amorcillo. Lobo y amorcillo cuidan tus sueños esta noche.",
      subtext: "Hasta mañana, que sueñes con cosas hermosas",
      tag: "Noche tranquila",
    },
    {
      quote: "Corazoncillo, que duermas calientita. Mañana te tengo listo otro reporte del clima 🐾",
      subtext: "Lobo con sus patitas dobladas de sueño",
      tag: "Dulces sueños",
    },
    {
      quote: "Amorcillo, traje mi telescopio y descubrí una constelación que tiene tu forma brillante ✨🔭",
      subtext: "Lobo astrónomo estudiando las estrellas de Juárez",
      tag: "Lobo astrónomo",
    },
    {
      quote: "¡Corazoncillo! Ya me puse mi gorrito de estrellas y leí un capítulo de 'Dog Dreams'.",
      subtext: "Lobo bostezando a todo lo que da",
      tag: "Lectura nocturna",
    },
    {
      quote: "Amorcillo, apaga la luz y pon la alarma. Mañana será otro gran día para los tres.",
      subtext: "Lobo cerrando un ojo para verificar que estés cómoda",
      tag: "Ronda nocturna",
    },
    {
      quote: "Corazoncillo, ¿me das mi caricia de buenas noches detrás de las orejitas? 🐾",
      subtext: "Lobo acomodándose en su camita redonda",
      tag: "Caricia obligatoria",
    },
    {
      quote: "Amorcillo, que sueñes con cachorritos, playas tranquilas y mucho amor.",
      subtext: "Lobo suspirando profundamente en sueños",
      tag: "Bendición nocturna",
    },
    {
      quote: "Corazoncillo, cambio y fuera... Lobo entra en modo ahorro de energía zzz...",
      subtext: "El reporte del clima volverá al amanecer",
      tag: "Modo zzz",
    },
  ],
};

/**
 * Frases sorpresa cuando Miriam / Corazoncillo toca a Lobo en la pantalla (Triplicadas a 24+)
 */
export const TAP_EASTER_EGGS: string[] = [
  "¡WOUF! ¡Corazoncillo, amorcillo me pidió que te diera este beso enorme! 😘❤️",
  "¡Me hiciste cosquillitas en la pancita, Amorcillo! 🐾✨",
  "Corazoncillo, eres la persona favorita de Lobo y de amorcillo en todo el mundo 💕",
  "¡Lobo te quiere mil ochomil, Amorcillo! *mueve la colita a 100 por hora* 🐕",
  "¡Alerta de ternura! Amorcillo me sopló al oído que hoy te ves guapísima 🥰",
  "¡Patita arriba para el mejor Corazoncillo de Ciudad Juárez! 🐾",
  "Lobo dice: '¡Beso con lengüetazo de perro aprobado para Amorcillo!' 🐶",
  "¡Wouf! Amorcillo te manda un apapacho rompecostillas especial de hoy ❤️",
  "¡Corazoncillo! Lobo certifica que nadie te ama más que tu amorcillo 📜💕",
  "Amorcillo, ¡acabas de desbloquear un aullido de amor! ¡Auuuuuuu! 🐺",
  "¡Corazoncillo! Si fueras una croqueta, serías la de sabor tocino premio mayor 🥓",
  "Amorcillo, ¿ya le dijiste a tu amorcillo cuánto lo quieres hoy? 🤭❤️",
  "¡Atención Corazoncillo! Este Alaskan defendería tus sonrisas contra cualquier villano 🦸‍♂️",
  "Amorcillo, tienes permiso oficial para descansar 10 minutos y comer algo rico 🍰",
  "¡Corazoncillo! Me encanta cuando me rascas el cuello justo abajo del collar metálico 🐾",
  "Amorcillo, hoy decreté que todo te va a salir perfecto y sin estrés ✨",
  "¡Corazoncillo detectada en Campestre Senecú! Niveles de ternura al 1000% 📈",
  "Lobo dice: 'Amorcillo + Corazoncillo + Lobo = La mejor manada del universo' 🐺❤️",
  "¡Wuf! Si tienes frío abrázate a amorcillo, si tienes calor tómate un frappé 🥤",
  "¡Corazoncillo! Lobo te da un diez de diez en ser la novia más linda del planeta 🌟",
  "Amorcillo, ¿a poco no soy el Alaskan más consentido gracias a ti? 🥰",
  "¡Corazoncillo, te ganaste un vale por 5 besos de amorcillo y 2 lengüetazos míos!",
  "Amorcillo, pase lo que pase hoy, recuerda que eres fuerte, inteligente y hermosa 💖",
  "¡Fin del comunicado canino! Lobo vuelve a su siesta... te amo Corazoncillo 💤",
];
