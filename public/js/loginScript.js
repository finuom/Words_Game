var socket = io();
var nome_de_usuario;
var palavrasAcertadas = 0;
login();

function login(){
	var loginBox = document.querySelector('.loginbox');
	loginBox.innerHTML = "";
	
	var h1 = document.createElement('h1');
	h1.innerHTML = "Faça o Login";
	loginBox.appendChild(h1);
	
	var u = document.createElement('p');
	u.innerHTML = "Usuário";
	aviso = document.createElement('span');
	aviso.innerHTML = " *Usuário ou Senha incorretos";
	aviso.classList.add('aviso');
	aviso.classList.add('hidden');
	u.appendChild(aviso);
	loginBox.appendChild(u);
	
	var inpU = document.createElement('INPUT');
	inpU.id = 'usuario';
	inpU.setAttribute("type", "text");
	inpU.setAttribute("placeholder", "Insira seu Nome");
	loginBox.appendChild(inpU);
	
	var s = document.createElement('p');
	s.innerHTML = "Senha";	
	loginBox.appendChild(s);
	
	var inpS = document.createElement('INPUT');
	inpS.id = 'senha';
	inpS.setAttribute("type", "password");
	inpS.setAttribute("placeholder", "Insira sua Senha");
	loginBox.appendChild(inpS);
	
	var btnLogar = document.createElement('button');
	btnLogar.innerHTML = 'ENTRAR';
	btnLogar.id = 'btnLogar';
	btnLogar.setAttribute("onclick", "logar()");
	loginBox.appendChild(btnLogar);
	
	var btnCadastrar = document.createElement('button');
	btnCadastrar.innerHTML = 'CADASTRAR NOVA CONTA';
	btnCadastrar.id = 'btnCadastrar';
	btnCadastrar.setAttribute("onclick", "cadastro()");
	loginBox.appendChild(btnCadastrar);		
}

function logar() {	
	usuario = document.getElementById("usuario");
	var u = usuario.value;
	senha = document.getElementById("senha");
	var s = senha.value;
	if(u == "" || s == ""){
		alert("Por favor, informe todas as informações");
		return;
	}	
	socket.emit('logar', {usuario: u, senha: s});	
	nome_de_usuario = u;
}

socket.on('negar', function(){
	const aviso = document.querySelector('.aviso');
	aviso.classList.remove('hidden');
});

function cadastro(){
	loginBox = document.querySelector('.loginbox');
	var h1 = loginBox.querySelector('h1');
	h1.innerHTML = "Faça o Cadastro";
	loginBox.removeChild(loginBox.querySelector('#btnLogar'));
	loginBox.removeChild(loginBox.querySelector('#btnCadastrar'));
	aviso = document.querySelector('.aviso');
	aviso.classList.add('hidden');
	aviso.innerHTML = " *Usuário já existe!";
	var p = document.createElement('p');
	p.innerHTML = 'E-Mail'
	loginBox.appendChild(p);
	var inp = document.createElement('INPUT');
	inp.id = 'email';
	inp.setAttribute("type", "text");
	inp.setAttribute("placeholder", "Insira seu E-Mail");
	loginBox.appendChild(inp);
	var btnCadastrar = document.createElement('button');
	btnCadastrar.innerHTML = 'CADASTRAR';
	btnCadastrar.id = 'btnCadastrar';
	btnCadastrar.setAttribute("onclick", "cadastrar()");
	loginBox.appendChild(btnCadastrar);
}

function cadastrar(){
	usuario = document.getElementById("usuario");
	var u = usuario.value;
	senha = document.getElementById("senha");
	var s = senha.value;
	email = document.getElementById('email');
	var e = email.value;
	if(u == "" || s == "" || e == ""){
		alert("Por favor, informe todas as informações");
		return;
	}	
	socket.emit('cadastrar', {usuario: u, senha: s, email: e});		
}

socket.on('cadastrado', function(){
	alert('Usuário cadastrado!');
	login();
});

socket.on('permitir', function(){
	body = document.querySelector('body');
	d1 = document.querySelector('.d1');
	if(d1 != null){
		var c01 = document.querySelector('.c01');	
		c01.innerHTML = '';		
	}
	else{
		body.innerHTML = '';
		d1 = document.createElement('div');
		d1.className = 'd1';
		
		var c01 = document.createElement('div');	
		c01.className = 'c01';
		d1.appendChild(c01);
		
		var c04ec05 = document.createElement('div');
		c04ec05.className = 'c04ec05';
		
		var c04 = document.createElement('div');	
		c04.className = 'c04';
		var container = document.createElement('div');
		c04.appendChild(container);
		socket.on('adicionarPalavra', function(palavra){
			var p = document.createElement('p');
			p.innerHTML = palavra;
			container.appendChild(p);	
			if(container.childElementCount > 4){
				container.removeChild(container.querySelector('p'));
			}
		});		
		var inp = document.createElement('INPUT');
		inp.setAttribute("type", "text");
		inp.setAttribute("style", "text-transform:uppercase");
		inp.addEventListener("keyup", function(event) {
			if (event.key == "Enter") {
				var maiusculo = inp.value.toUpperCase();
				inp.value = '';
				socket.emit('chutarPalavra', {palavra: maiusculo, usuario:nome_de_usuario, palavras_acertadas: palavrasAcertadas}); // emite uma mensagem junto com a letra			
			}
		});
		c04.appendChild(inp);
		c04ec05.appendChild(c04);
		
		var c05 = document.createElement('div');	
		c05.className = 'c05';
		var nome = document.createElement('p');
		nome.id = 'nome';
		nome.innerHTML = nome_de_usuario;
		c05.appendChild(nome);
		var pAcertadas = document.createElement('p');
		pAcertadas.id = 'pAcertadas';
		pAcertadas.innerHTML = 'Palavras Acertadas: ' + palavrasAcertadas;
		c05.appendChild(pAcertadas);
		var vez = document.createElement('p');
		vez.id = 'vez';
		vez.innerHTML = '>>SUA VEZ<<';
		vez.style.visibility = 'hidden';
		c05.appendChild(vez);
		c04ec05.appendChild(c05);
		
		d1.appendChild(c04ec05);
		
		var c03 = document.createElement('div');	
		c03.className = 'c03';
		//Cria várias divs com caracteres de A até Z, usando valores da tabela ASCII
		for(i = 65; i < 91; i++){
			var div = document.createElement('div');
			div.innerHTML = String.fromCharCode(i);
			div.setAttribute("onclick","verifica(this)");		
			c03.appendChild(div);
		}
		d1.appendChild(c03);
			
		body.appendChild(d1);
	}					
	
	if(document.querySelector('#placar') == null){
		var d2 = document.createElement('div');
		d2.className = 'd2';
		
		var placar = document.createElement('div');
		placar.id = 'placar';
		
		var placarh1 = document.createElement('h1');
		placarh1.innerHTML = 'Placar de Jogadores';
		placar.appendChild(placarh1);	
		
		var placarh2 = document.createElement('h2');
		placarh2.innerHTML = 'Palavras Acertadas:';
		placar.appendChild(placarh2);
		
		d2.appendChild(placar);	
		body.appendChild(d2);
	}			
});		

socket.on('atualizarplacar', function(dados){
	var childPs = document.getElementById('placar').getElementsByTagName('p');
	var childSpans = document.getElementById('placar').getElementsByTagName('span');
	for(let i = 0; i < childPs.length; i++){
		var childP = childPs[i];
		console.log(childP.innerHTML);
		if(childP.innerHTML == dados.usuario){
			childSpans[i].innerHTML = dados.palavras_acertadas;				
			return;
		}
	}	
	var placar = document.getElementById('placar');
	
	var placarJogador = document.createElement('p');
	placarJogador.id = 'placarJogador';
	placarJogador.innerHTML = dados.usuario;
	placar.appendChild(placarJogador);
	
	var placarPalavras = document.createElement('span');
	placarPalavras.id = 'placarPalavras';
	placarPalavras.innerHTML = dados.palavras_acertadas;
	placar.appendChild(placarPalavras);
});

var palavra;
var minhavez = false;

socket.on('suavez', function(){
	var vez = document.getElementById('vez');
	alert('agora é sua vez!');
	if(vez != undefined)
		vez.style.visibility = 'visible';
	minhavez = true;
});

socket.on('inicia',function inicia(dados){				
	palavra = dados.palavraEscolhida;
	dica = dados.dica;
	console.log('dica: ' + dica);
	var container = document.querySelector('.c01');
	for(let i = 0; i < palavra.length; i++){		
		
		var under = document.createElement('div');
				
		if(palavra[i] == ' '){
			under.classList.add('espaco');
		}else{
			under.classList.add('underline');
		}
		under.id = i;		
		container.appendChild(under);		
	}
	var pDica = document.createElement('p');
	pDica.id = 'dica';
	pDica.innerHTML = 'dica: ' + dica;
	container.appendChild(pDica);
});

socket.on('letrasescolhidas', function (letrasEscolhidas){
	for (let i = 0; i < palavra.length; i++){
		for (let j = 0; j < letrasEscolhidas.length; j++){
			if(letrasEscolhidas[j] == palavra[i] && document.getElementById(i).innerHTML == ""){					
				document.getElementById(i).innerHTML = letrasEscolhidas[j];				
			}		
		}
	}
});

function verifica(elem){	
	//minhavez = true		
	if(1 == 1){ 
		var letra = elem.innerHTML; 
		socket.emit('escolher', letra); 
	}
	else{
		alert('Espere a sua vez');
	}
}

socket.on('novaescolha', function(letra){
	var acertosEscolha = 0;
	if(palavra != undefined)
		for (i = 0; i < palavra.length; i++){					
			if(letra == palavra[i] && document.getElementById(i).innerHTML == ""){					
				document.getElementById(i).innerHTML = letra;
				acertosEscolha++;
			}		
		}
	if(minhavez == true){
		if(acertosEscolha > 0)
			alert('Acertou: ' + acertosEscolha);
		else
			alert('Errou!');
		minhavez = false;
		vez.style.visibility = 'hidden';
	}	
});

socket.on('novochutepalavra', function(chutePalavra){
	for (i = 0; i < palavra.length; i++){	
		for(j = 0; j < chutePalavra.length; j++){
			if(chutePalavra[j] == palavra[i] && document.getElementById(i).innerHTML == ""){					
				document.getElementById(i).innerHTML = chutePalavra[j];				
			}
		}
	}
	if(minhavez == true){
		minhavez = false;
		vez.style.visibility = 'hidden';
	}	
});

socket.on('ganhou', function(){			
	alert('Você Ganhou!');
	palavrasAcertadas++;
	document.getElementById('pAcertadas').innerHTML = 'Palavras Acertadas: ' + palavrasAcertadas;
});

socket.on('fim', function(){			
	alert('Fim de Jogo!');
});

	