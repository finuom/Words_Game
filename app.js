var express = require('express');
var app = express();

var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/login.html');	
});
app.use('/client',express.static(__dirname + '/client'));
app.use(express.static('public'));
 
serv.listen(3444, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3444);
});
console.log("Servidor iniciado.");

var TAFFY = require( 'taffy' );

//usuarios = TAFFY([{"usuario" : "abc", "senha": "123", "email":"a@gmail.com", "palavrasAcertadas" : 0}]);
palavras = TAFFY([{"id" : 1, "nome" : "ALFACE", "dica" : "verdura"}, {"id" : 2, "nome" : "BETERRABA", "dica" : "vegetal"}, {"id" : 3, "nome" : "PATINETE", "dica" : "objeto esportivo"}, 
				{"id" : 4, "nome" : "TOMATE", "dica" : "fruta"}, {"id" : 5, "nome" : "REPOLHO", "dica" : "vegetal"}, {"id" : 6, "nome" : "ORNITORRINCO", "dica" : "animal"},
				{"id" : 7, "nome" : "BARATA", "dica" : "inseto"}, {"id" : 8, "nome" : "MICO LEAO DOURADO", "dica" : "animal"}, {"id" : 9, "nome" : "GAFANHOTO", "dica" : "inseto"},
				{"id" : 10, "nome" : "TRAVESSEIRO", "dica" : "objeto de quarto"}, {"id" : 11, "nome" : "WINDOWS", "dica" : "sistema operacional"}, {"id" : 12, "nome" : "HIPOPOTAMO", "dica" : "animal"},
				{"id" : 13, "nome" : "BATERIA", "dica" : "instrumento musical"}, {"id" : 14, "nome" : "BERINJELA", "dica" : "legume"}, {"id" : 15, "nome" : "HOVERBOARD", "dica" : "objeto esportivo"},
				{"id" : 16, "nome" : "LEITE", "dica" : "bebida"}, {"id" : 17, "nome" : "PLUMA", "dica" : "objeto (muito leve)"}, {"id" : 18, "nome" : "PASSARO", "dica" : "animal"},
				{"id" : 19, "nome" : "UVA", "dica" : "fruta"}, {"id" : 20, "nome" : "GUARDA ROUPAS", "dica" : "objeto de quarto"}, {"id" : 21, "nome" : "POMBO", "dica" : "animal"}, 
				{"id" : 22, "nome" : "CACHECOL", "dica" : "vestimenta"}, {"id" : 23, "nome" : "FIGADO", "dica" : "órgão do corpo humano"}, {"id" : 24, "nome" : "CANADA", "dica" : "país"},
				{"id" : 25, "nome" : "SUCO DE TANGERINA", "dica" : "bebida"}, {"id" : 26, "nome" : "TOMADA", "dica" : "objeto de parede"}, {"id" : 27, "nome" : "COMPUTADOR", "dica" : "objeto eletrônico"},
				{"id" : 28, "nome" : "SAPATO", "dica" : "calçado"}, {"id" : 29, "nome" : "MILHO VERDE", "dica" : "legume"}, {"id" : 30, "nome" : "ESTILETE", "dica" : "arma branca"},
				{"id" : 31, "nome" : "PIANO", "dica" : "instrumento musical"}, {"id" : 32, "nome" : "TACO DE BEISEBOL", "dica" : "equipamento esportivo"}, {"id" : 33, "nome" : "CINZA", "dica" : "cor"},
				{"id" : 34, "nome" : "MARROM", "dica" : "cor"}, {"id" : 35, "nome" : "ESPADA", "dica" : "arma branca"}, {"id" : 36, "nome" : "MACHADO", "dica" : "arma branca"}]);

usuarios = TAFFY();
usuarios.store('./scratch');

console.log("\nTabela de usuarios: ");
console.log(usuarios().get());
console.log("\nTabela de Palavras: ");
console.log(palavras().get());
 
// Lista de sockets
var SOCKET_LIST = {};
// Lista de jogadores
var PLAYER_LIST = {};
 
// Variável que armazena as informações do jogador
var Player = function(id){
    var self = {
        id: id,    
		numero: 0
    }
    return self;
}

var io = require('socket.io')(serv,{});
// Variável aleatória usada como indíce da próxima palavra
var aleatorio = Math.floor(Math.random() * 35) + 1;
console.log("Palavra(ID): " + aleatorio);
// Variáveis de controle de jogadores
var aux = 0;
var aux2 = 0;
var auxJogadores = [];
var id = 0;
// Escolhe uma palavra aleatória
var palavraEscolhida = palavras({id:aleatorio}).first().nome;	
// Guarda a dica da palavra
var dica = palavras({id:aleatorio}).first().dica; 
// Array que guarda todas as letras escolhidas escolhidas durante o jogo
var letrasEscolhidas = [];

function proximoJogador(){
	console.log("1. Aux2:");
	console.log(aux2);
			
	if(aux2 >= Object.keys(PLAYER_LIST).length - 1)
		aux2 = 0;
	else
		aux2++;
		
	console.log("2. Aux2:");
	console.log(aux2);
			
	console.log('Jogadores: ', auxJogadores); 
			
	for(let i in SOCKET_LIST){
		for(let j in PLAYER_LIST){
			if(i == j && PLAYER_LIST[j].numero == auxJogadores[aux2]){
				SOCKET_LIST[i].emit('suavez');
				console.log('Vez do jogador ' + auxJogadores[aux2]);
			}
		}
	}
}

io.sockets.on('connection', function(socket){	
    socket.id = id; 					
	id++;									
    SOCKET_LIST[socket.id] = socket;	
    console.log('Jogador ' + socket.id + ' conectado'); 
    var player = Player(socket.id);	
    player.numero = aux;
	auxJogadores.push(aux);
	aux++;
    PLAYER_LIST[socket.id] = player;   
   
    socket.on('escolher', function(letra){
        console.log('letra escolhida:' + letra);
        for(var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
            var letra = letra;
            socket.emit('novaescolha',letra);
			letrasEscolhidas.push(letra);
        }		
				//console.log("Tamanho da lista de jogadores:");
				//console.log(Object.keys(PLAYER_LIST).length);
		proximoJogador();		
    });
	
	socket.on('chutarPalavra', function(dados){		
		var palavraEscolhidaAux = palavraEscolhida;
		if(dados.palavra === palavraEscolhida){
			var aleatorio = Math.floor(Math.random() * 35) + 1;
			console.log("Palavra(ID): " + aleatorio);
			palavraEscolhida = palavras({id:aleatorio}).first().nome;				
			dica = palavras({id:aleatorio}).first().dica;			
			var u = dados.usuario;			
			if(usuarios().filter({usuario: dados.usuario}).count() > 0){
				usuarios().filter({usuario: dados.usuario}).update({palavrasAcertadas: dados.palavras_acertadas + 1});								
			}			
			for(let i in SOCKET_LIST){
				var s = SOCKET_LIST[i];			
				if(dados.palavra === palavraEscolhidaAux){					
					s.emit('novochutepalavra', palavraEscolhidaAux);
					s.emit('adicionarPalavra', dados.palavra);
					s.emit('fim');
					s.emit('permitir', 'usuario');											
					s.emit('inicia', {palavraEscolhida: palavraEscolhida, dica: dica});
					s.emit('atualizarplacar', {usuario: dados.usuario, palavras_acertadas: dados.palavras_acertadas + 1});
					letrasEscolhidas = [];
				}else{
					s.emit('adicionarPalavra', dados.palavra);
				}			
			}
			socket.emit('ganhou');
			socket.emit('suavez');						
		}
	});
	
	socket.on('logar', function(dados){
		var u = dados.usuario;
		var s = dados.senha;
		if(usuarios().filter({usuario: u, senha: s}).count() > 0){
			socket.emit('permitir', u);
			socket.emit('inicia', {palavraEscolhida: palavraEscolhida, dica: dica});
			socket.emit('letrasescolhidas', letrasEscolhidas);
			if(PLAYER_LIST[socket.id].numero == auxJogadores[aux2] || Object.keys(PLAYER_LIST).length == 1){
				socket.emit('suavez');
				console.log('Vez do jogador ' + PLAYER_LIST[socket.id].numero);
			}			
		}
		else
			socket.emit('negar');
	});
	
	socket.on('cadastrar', function(dados){
		var u = dados.usuario;
		var s = dados.senha;
		var e = dados.email;
		if(usuarios().filter({usuario: u}).count() == 0){
			usuarios.insert({usuario:u, senha:s, email:e, palavrasAcertadas: 0});
			socket.emit('cadastrado');
			console.log(usuarios().get());
		}
		else
			socket.emit('negar');
	});
    // O socket cliente automaticamente emite essa mensagem, o servidor deleta os dados do cliente relacionados ao socket/jogador, ajusta os jogadores, e passa para o próximo jogador caso o jogador tenha saido no seu turno
	socket.on('disconnect',function(){   
		var a = false;
		for(let i in auxJogadores){
			if(auxJogadores[i] === PLAYER_LIST[socket.id].numero){
				if(aux2 == Object.keys(PLAYER_LIST).length - 1){
					aux2++;
					proximoJogador();
					auxJogadores.splice(i, 1); //Retira o número do jogador da lista de participantes	
					a = true;
					break;							
				}else{
					proximoJogador();
					auxJogadores.splice(i, 1); //Retira o número do jogador da lista de participantes	
				}				
			}
		}
		
		console.log(auxJogadores); 
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		console.log('Jogador ' + socket.id + ' desconectado');
   });
});
 
setInterval(function(){
    var pack = [];
    for(let i in PLAYER_LIST){
        var player = PLAYER_LIST[i];   
    }            
},1000/25);
 
