const express = require('express');
const request = require('request');

const config = require('./config');

const app = express();
const access_token = config.accessToken;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello there, this bot is your personal teacher');
});

app.get('/webhook', (req, res) => {
    if(req.query['hub.verify_token'] === config.verifyToken){
        res.send(req.query['hub.challenge']);
    } else {
        res.send('My personal teacher no tienes permisos.');
    }
});

app.post('/webhook', (req, res) => {
    const webhook_event = req.body.entry[0];

    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        })
    }
    
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message)
    } else if(event.postback) {
        handlePostback(senderId, event.postback.payload)
    } 
}

function handleMessage(senderId, event){
    if(event.text){
        receipt(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function handlePostback(senderId, payload){
    console.log(payload);
    switch (payload) {
        case "GET_STARTED_PUGPIZZA":
            console.log(payload)
        break;
        case "PIZZAS_PAYLOAD":
            showPizzas(senderId);
        break;
        case "PEPPERONI_PAYLOAD":
            sizePizza(senderId);
        break;
    }
}

function handleAttachments(senderId, event){
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
        break;
        case "video": 
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
      case "file":
            console.log(attachment_type);
        break;
      default:
            console.log(attachment_type);
        break;
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on" //mark_seen
    }
    callSendApi(messageData);
}       

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Quieres una Pizza?",
                    "payload": "PIZZAS_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de",
                    "payload": "ABOUT_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function callSendApi(response) {
    console.log(response);
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
        },
        function(err) {
            if(err) {
                console.log('Ha ocurrido un error')
            } else {
                console.log('Mensaje enviado')
            }
        }
    );
};

function showPizzas(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Peperoni",
                            "subtitle": "Con todo el sabor del peperoni",
                            "image_url": "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Pepperoni",
                                    "payload": "PEPPERONI_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Pollo BBQ",
                            "subtitle": "Con todo el sabor del BBQ",
                            "image_url": "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Pollo BBQ",
                                    "payload": "BBQ_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

function sizePizza(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Individual",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion individual de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Individual",
                                    "payload": "PERSONAL_SIZE_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Mediana",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion Mediana de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Mediana",
                                    "payload": "MEDIUM_SIZE_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    console.log('SENDED');
    callSendApi(messageData);
}

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}

function contactSuppport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola este es el canal de soporte, ¿quieres llamarnos?",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a un asesor",
                            "payload": "+571231231231"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function showLocations(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Sucursal Mexico",
                            "image_url": "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
                            "subtitle": "Direccion bonita #555",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Sucursal Colombia",
                            "image_url": "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
                            "subtitle": "Direccion muy lejana #333",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Oscar Barajas",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "https://platzi.com/order/123",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Platzi HQ",
                        "street_2": "---",
                        "city": "Mexico",
                        "postal_code": "543135",
                        "state": "Mexico",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuent",
                            "amount": 1.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "Pizza Pepperoni",
                            "subtitle": "La mejor pizza de pepperoni",
                            "quantity": 1,
                            "price": 10,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        },
                        {
                            "title": "Bebida",
                            "subtitle": "Jugo de Tamarindo",
                            "quantity": 1,
                            "price": 2,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function getLocation(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Ahora ¿Puedes proporcionarnos tu ubicación?",
            "quick_replies": [
                {
                    "content_type": "location"
                }
            ]
        }
    }
    callSendApi(messageData);
}

app.listen(5000, () => {
    console.log('server is running in port: 5000');
});