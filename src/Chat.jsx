import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Divider, Form, Icon, Input, Message, MessageHeader } from 'semantic-ui-react';
import ScrollToBottom from 'react-scroll-to-bottom'
const Chat = ({socket, username, room}) => {

    const [currentMessage,setCurrentMessage] = useState("")
    //lista de mensajes
    const [messagesList, setMessageList] = useState([]);


    const sendMessage = async () =>{
        //si hay mensaje y usuario 
        if(username && currentMessage){
            const info = {
                message: currentMessage,
                room,
                author: username,
                //mandar horas y minutos del envio
                time: new Date(Date.now()).getHours()+
                ":" +
                 new Date(Date.now()).getMinutes(),
            };

            //informacio a emitit

            await socket.emit("send_message", info)
            setMessageList((list)=>[... list, info]); 
            //vaciar la caja de mensajes
            setCurrentMessage("") 
        }
    }


    useEffect(()=>{
        const messageHandle = (data) =>{          
                //ejecutar cuando se reciba el mensaje, esta la pendiente
                //recibir la informacion del mensaje
                //la lista de mensajes va a ser modificada por los nuevos mensajes
                //la liasta tiene los mensjaes previos y nuevos 
                setMessageList((list)=>[... list, data])           
        }
        socket.on("receive_message", messageHandle);
        //apaga el mensaje recibido para evitar que se dupliquen
        return () => socket.off("receive_message", messageHandle);
    },[socket]);

  return (
    <Container>
    <Card fluid>
    <Card.Content header= {`Chat en vivo | Sala:${room}`} />
            <ScrollToBottom>
            <Card.Content style={{height: "400px", padding: "5px"}}>
                
                
            {messagesList.map((item,i)=>{
                return(
             <span key={i}>
                 
    <Message style={{textAlign: username === item.author?'right': 'left'}}
    success={username === item.author}
    info={username !== item.author}


    
    >
    <Message.Header>{item.message}</Message.Header>
    <p>Enviado por: <strong>{item.author}</strong> a las: {""}
    <i>{item.time}</i>
    </p>
    
  </Message>
  <Divider/>            
 </span>
                );
            })}
            
    </Card.Content>
    </ScrollToBottom>
    <Card.Content extra>
        <Form>
        <Form.Field>
            <div className="ui action input">
            <input 
            value={currentMessage}
              
              type="text" placeholder="Mensaje..."
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyUp={(e)=>{
                if(e.key==="Enter") {
                    sendMessage()
                }
              }}
            />
            <button type="button" onClick={()=> sendMessage()}
            className='ui teal icon right labeled button'>
                <Icon name='send'/>
                Enviar
            </button>
            </div>
              

            
        </Form.Field>
        </Form>    
    </Card.Content>
  </Card>
  </Container>
  );
};

export default Chat