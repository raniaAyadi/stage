var	nbrsection = 0;
var	arrCons = [];
var	arrProd = [];
var	arrHelp = [];
var	product;
var	advice;
var	help;
var	questions;
var	reponses;
var	quest_action;
var	questionnaire_reply;
var	questionnaire_id;
var	company_questionnaire_ids = {'questionnaire' : null,
				     'questionnaire-reply': null}
var	globalVariables = {};
var	report_temp;
var	main_rules;
var	report;
var	newrep = 1;

var infocomp;

var div_sumup = 0;

if (getParameterByName("newquest", window.location.href) == "true")
//Get Query string from url with javascript
    {
	newrep = 0;
    }

/* Permet de naviguer entre les différents onglets de la page questionnaire */
function	changeOnglet(numero)
{
    let nombreOnglets = 5;
    // Cache tout les onglets
    for (var i = 0; i < nombreOnglets; ++i)
    {
	document.getElementById("onglet" + i).style.display = "none";
    }
    // Affiche le sélectionné et le surligne seul en orange
    document.getElementById("onglet" + numero).style.display = "block";
    document.getElementById("selected").removeAttribute("id");
    document.getElementsByTagName("span")[1 + numero].setAttribute("id", "selected");
}

/* Affiche touts les fiches conseil */
/* Les valeurs i+1 sont données aux fiches pour éviter d'avoir des 0 lors de l'ajout au panier (NULL) */
function	loadcons(data, target)
{
    let i = 0;
    let toAppend = [];
    while (data.resources[i])
    {
	toAppend += '<div class="row"><div class="col-md-12">';
	toAppend += '<p class="navbar"><span id="cons' + (i + 1) + '" onclick="printcons(' + (i + 1) + ')">';
	toAppend += data.resources[i].title.toUpperCase() + '</span></p></div></div>';
	++i;
    }
    $(target).append(toAppend);
}

function	printcons(index)
{
    let i = 0;
    let u = 0;
    let toAppend = "";
    $('#listcons > *').remove();
    index -= 1;
    if (advice)
    {
	toAppend += '<h2>' + advice.resources[index].title + '</h2>';
	while (advice.resources[index].contents[i])
	{
	    toAppend += '<h3>' + advice.resources[index].contents[i].title + '</h3>';
	    toAppend += advice.resources[index].contents[i].contents;
	    ++i;
	}
	index += 1;
	toAppend += '<a onclick="dunkcons(' + index + ')">Ajouter au panier</a>';
	$('#listcons').append(toAppend);
    }
}

/* Affiche toutes les fiches produit */
/* Les valeurs i+1 sont données aux fiches pour éviter d'avoir des 0 lors de l'ajout au panier (NULL) */
function	loadprod(data, target)
{
    let i = 0;
    let toAppend = [];
    while (data.resources[i])
    {
	toAppend += '<div class="row"><div class="col-md-12">';
	toAppend += '<p class="navbar"><span id="prod' + (i + 1) + '" onclick="printprod(' + (i + 1) + ')">';
	toAppend += data.resources[i].title.toUpperCase() + '</span></p></div></div>';
	++i;
    }
    $(target).append(toAppend);
}

function	printprod(index)
{
    let i = 0;
    let toAppend = "";
    $('#listprod > *').remove();
    index -= 1;
    if (product)
    {
	toAppend += '<h2>' + product.resources[index].title + '</h2>';
	while (product.resources[index].contents[i])
	{
	    toAppend += '<h3>' + product.resources[index].contents[i].title + '</h3>';
	    toAppend += product.resources[index].contents[i].contents;
	    ++i;
	}
	index += 1;
	toAppend += '<a onclick="dunkprod(' + index + ')">Ajouter au panier</a>';
	$('#listprod').append(toAppend);
    }
}

function	loadhelp(info)
{
    let i = 0;
    let toAppend = "";
    let valuesheet = "";
    while (info.resources[i])
    {
	valuesheet = info.resources[i].id.split("-");
	toAppend += '<div class="row"><div class="col-md-12">';
	toAppend += '<p class="nav_ar"><span id="aide' + (i + 1) + '" onclick="printhelp(' + valuesheet[0] + ', ' + valuesheet[1] + ', ' + (i + 1) + ')">';
	toAppend += info.resources[i].title.toUpperCase() + '</span></p></div></div>';
	++i;
    }
    $('#helpsheet').append(toAppend);
}

function	printhelp(id1, id2, index)
{
    let id = id1 + '-' + id2;
    console.log(id);
    $.ajax(
	{
	    type: "POST",
	    url: "/onehelp",
	    data: {"idsheet" : id},
	    success : (function(info)
		       {
			   info = JSON.parse(info);
			   console.log(info);
			   let i = 0;
			   let toAppend = "";
			   $('#listhelp > *').remove();

			   toAppend += '<h2>' + info.resources[0].title + '</h2>';
			   while (info.resources[0].contents[i])
			   {
			       toAppend += '<h3>' + info.resources[0].contents[i].title + '</h3>';
			       toAppend += info.resources[0].contents[i].contents;
			       ++i;
			   }
			   var topkek = ('_' + id1 + '_' + id2);
			   console.log(topkek);
			   toAppend += '<a onclick="dunkhelp(\'' + topkek + '\', ' + index + ')">Ajouter au panier</a>';
			   $('#listhelp').append(toAppend);
		       }),
	    error : (function(err)
		     {
			 console.log(err);
		     }),
	});
}

/* Récupère les questions du questionnaire */
function	getquest(data)
{ console.log("blaaaaaaaaaaaaaaaaaaaaaaaaaaaa "+data.quest);
    $.ajax(
	{
	    type: "POST",
	    url: "/getquest",
	    data: {"quest" : data.quest}, //on envoie le questionnaire pour récuperer les questions
	    success : (function(info) //info contient les questions
		       {
			   questionnaire_id = info.id;
			   main_rules = info.rules; //les conditions de l'affichage des questions dans le compte rendu.
			   $('#cmpn').append(data.company);
			   $('#theme').val(data.theme);
			   $('#advisor').val(data.advisor);
			   printsect(info); //affiche la liste des sections
			   showquest(info); //recupérer les reponses d'un questionnaire préscie (id recuperer à partir de cookies)
		       }),
	    error : (function(err)
		     {
			 console.log(err);
		     }),
	});
}
//affichage des questions et des réponses
function  parse_questionnaire(data, answers, target)
{
    let toAppend = [];
    let sumup = 0;
    let j;

    nbrsection = 0;
    if (target == "#listrendu")
    {
	sumup = 1;
    }
    while (data.sections[nbrsection] != undefined)
    {
	j = 0;
	toAppend.push('<div id="section' + nbrsection + '">'); //ajouter de nouvel élément
	while (data.sections[nbrsection].questions[j] != undefined) //tant que il ya des questions dans la section
	{
	    toAppend = toAppend.concat(append_question(data.sections[nbrsection].questions[j], answers, "quest"));
	    ++j;
	}
	toAppend.push('</div>');
	++nbrsection;
    }
    toAppend = toAppend.join("")
    $(target).append(toAppend);
    switchsection(0);
}

/* Affiche les reponses correspendantes aux questions du questionnaire rangées par sections */
function    showquest(data) //data contient les Questions (qui on a recupérer depuis la base de données )
{
    questions = data;
    if (getParameterByName("newquest", window.location.href) == "false")
    {
	$.ajax(
	    {
		type: "GET", //on récupére de la base de données "base_url/questionnaire-replies" les réponses
		url: 'info-questionnaire',
		datatype: "json",
		success: function(json) //json contient les reponses d'un id définie qui est passé en paramétre infomet cookies
		{

		    questionnaire_reply = json;
		    if (json.resources != undefined)
			validatedP = json.resources[0].validatedP;
		    $("#DialogNom").val(json.resources[0].contactFirstName);
		    $("#DialogPrenom").val(json.resources[0].contactLastName);
		    $("#DialogMail").val(json.resources[0].contactEmail);
		    $("#DialogDate").val(json.resources[0].date);
		    reponses = questionnaire_reply.resources[0].questionAnswers;
		    quest_action = questionnaire_reply.resources[0].sectionActions;
		    globalVariables = questionnaire_reply.resources[0].globalVariableValues;
		    infocomp = {
			"Workforce": questionnaire_reply.resources[0].companyWorkforce,
			"Industry": questionnaire_reply.resources[0].companyIndustry,
		    };
		    parse_questionnaire(data, questionnaire_reply.resources[0].questionAnswers, '#list'); //affichage des questions et des réponses
				//#list c'est où on va inserer l'affichage des questions
		    Set_plugins();
		    if (json.resources[0].contactFirstName && json.resources[0].contactFirstName)
		    {
			let locutor = json.resources[0].contactFirstName + ' ' + json.resources[0].contactLastName;
			$('#locutor').val(locutor); //pour afficher le nom du locuteur
		    }
		    else
		    {
			console.log("Unregistered locutor");
		    }
		}
	    });
    }
    else
    {
	parse_questionnaire(data, undefined, '#list');
	Set_plugins();
    }
}


/*	1: au chargement de la page, cache toutes les sections sauf la premiere
	2: Si clic sur une section, l'affiche et cache les autres */
function	switchsection(index)
{
    let i = 0;

    $('.sectionlist').children('p').removeClass('navbar_select');
    $('.sectionlist').children('p').addClass('navbar');
    $('.sectionlist[value=' + index + ']').children('p').removeClass('navbar');
    $('.sectionlist[value=' + index + ']').children('p').addClass('navbar_select');
    $('#title_section').text($('.sectionlist[value=' + index + ']').find('span').text());

    while (i < nbrsection)
    {
	$('#section' + i).hide();
	++i;
    }
    $('#section' + index).show();
}

/* Affiche des differentes sections */
function	printsect(info)
//info contient LES Questions du questionnaire QUI CONTIENT plusieurs section chaque section regroupe un nombre de questions
{
    let i = 0;
    let toAppend = "";
    while (info.sections[i]) //les differentes section du questionnaire
    {
	toAppend += '<div class="row"><div class="col-md-12 sectionlist" onclick="switchsection(' + i + ')" value="' + i + '"><p class="navbar"><span href="#">';
	toAppend += info.sections[i].title + '</span></p></div></div>\n';
	++i;
    }
    $("#section").append(toAppend); //ajout des sections
}

/* Ajout au panier des fiches conseil */
/* ATTENTION les indices stockés sont 1 trop grands. Sans cela l'indice 0 bloque la chaine (NULL) */
function	dunkcons(index)
{
    let i = 0;
    let bool = 0;

    while (arrCons[i])
    {
	if (arrCons[i] == index)
	{
	    arrCons.splice(i, 1);
	    bool = 1;
	    $('#cons' + index).attr("class", "");
	    $('#cons' + index + ' > img').remove();
	}
	++i;
    }
    if (bool == 0)
    {
	arrCons.push(index);
	$('#cons' + index).attr("class", "encart");
	$('#cons' + index).append('<img src="checked1600.png" class="checked">');
    }
}

function	dunkprod(index)
{
    let i = 0;
    let bool = 0;

    while (arrProd[i])
    {
	if (arrProd[i] == index)
	{
	    arrProd.splice(i, 1);
	    bool = 1;
	    $('#prod' + index).attr("class", "");
	    $('#prod' + index + ' > img').remove();
	}
	++i;
    }
    if (bool == 0)
    {
	arrProd.push(index);
	$('#prod' + index).attr("class", "encart");
	$('#prod' + index).append('<img src="checked1600.png" class="checked">');
    }
}

function	dunkhelp(id, index)
{
    let i = 0;
    let bool = 0;

    while (arrHelp[i])
    {
	if (arrHelp[i] == id)
	{
	    arrHelp.splice(i, 1);
	    bool = 1;
	    $('#aide' + index).attr("class", "");
	    $('#aide' + index + ' > img').remove();
	}
	++i;
    }
    if (bool == 0)
    {
	arrHelp.push(id);
	$('#aide' + index).attr("class", "encart");
	$('#aide' + index).append('<img src="checked1600.png" class="checked">');
    }
}

/* print the needed sheets in the compte rendu */
function	update_cptrd_cons(data)
{
    let toAppend = "";
    let i = 0;

    while (i < arrCons.length)
    {
	toAppend += '<br /><div class="delimit sheet"><input type="checkbox" value="' + (arrCons[i] - 1) + '">';
	toAppend += data.resources[arrCons[i] - 1].title + '</div>';

	++i;
    }
    $('#selectedcons').append(toAppend);
}

function	update_cptrd_prod(data)
{
    let toAppend = "";
    let i = 0;

    while (i < arrProd.length)
    {
	toAppend += '<br /><div class="delimit sheet"><input type="checkbox" value="' + (arrProd[i] - 1) + '">';
	toAppend += data.resources[arrProd[i] - 1].title + '</div>';

	++i;
    }
    $('#selectedprod').append(toAppend);
}

function	update_cptrd_help(data)
{
    let toAppend = "";
    let item = "";
    let i = 0;
    let u = 0;

    while (i < arrHelp.length)
    {
	item = arrHelp[i].split("_");
	item = item[0] + '-' + item[1];
	while (data.resources[u] && item != data.resources[u].id)
	{
	    ++u;
	}
	toAppend += '<br /><div class="delimit sheet"><input type="checkbox" value="' + (arrHelp[i]) + '">';
	toAppend += data.resources[i].title + '</div>';

	u = 0;
	++i;
    }
    $('#selectedhelp').append(toAppend);
}

function	fillfield(target, data)
{
    let toAppend = "";
    let i = 0;

    while (data.resources[i])
    {
	toAppend += '<option value="' + data.resources[i].id + '">' + data.resources[i].name + '</option>';
	++i;
    }
    $(target).append(toAppend);
}

function	needhalp()
{
    let ape = $('#naf').val();

    let dept = $('#dept').val();

    let insee = dept * Math.pow(10, (5 - dept.toString().length));

    let domain = document.getElementById("projet");
    domain = domain.options[domain.selectedIndex].value;

    let means = document.getElementById("interv");
    means = means.options[means.selectedIndex].value;

    let filiere = document.getElementById("filiere");
    filiere = filiere.options[filiere.selectedIndex].value;

    let json = {'ape' : ape, 'dept' : dept, 'insee' : insee, 'domain' : domain, 'means' : means, 'industry' : filiere};
    $.ajax(
	{
	    type: "POST",
	    url: "/helpsheet",
	    data: json,
	    success : (function(info)
		       {
			   help = info;
			   loadhelp(info);
		       }),
	    error : (function(err)
		     {
			 console.log(err);
		     }),
	});
}

function modifycomp()
{

    function	set_questionnaire_entreprise(info, data)
    {
	let toAppend = [];
	company_data = { text: [],
			 textarea: [],
			 radios: [],
			 checkboxes: [],
			 nTexts: [],
			 nMTexts: [],
			 nMLongTexts: [],
			 n1Choice: [],
			 matrix: [],
			 city: [] };
	let answers = data.resources[0].questionAnswers;
	toAppend.push('<span>');
	for (let i = 0; info.sections[i] != undefined; ++i)
	{
	    toAppend.push('<br /><b>' + info.sections[i].title + '</b>');
	    for (let j = 0; info.sections[i].questions[j] != undefined; ++j)
	    {
		toAppend = toAppend.concat(append_question(info.sections[i].questions[j], answers, "company"));
	    }
	}
	toAppend.push('</span>');
	$('#company_questionnaire').append(toAppend.join(""));
	$('#company_questionnaire .wysiwyg').trumbowyg({
	    lang: 'fr',
	    btns : ['formatting','bold', 'italic',
		    'underline','justifyLeft', 'justifyCenter',
		    'justifyRight', 'justifyFull']
	});
    }

    function	send_questionnaire_entreprise()
    {
	globalVariables = {};
	get_rules("company");

	let posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: null,
	    contactLastName: null,
	    contactEmail: null,
	    questionnaire: { resource: "questionnaires/" + company_questionnaire_ids.questionnaire },
	    sectionActions: [],
	    validatedP: false,
	    questionAnswers: get_values("company"),
	    comments: [],
	    date: getCurrentDate(),
	    owner: { resource: "users/" + getCookie("uid") }
	};
	console.log("company-quest?reply=" + company_questionnaire_ids.questionnaire_reply);
	console.log("posted==" + posted);
	$.ajax({
	    type: 'POST',
	    url: "company-quest?reply=" + company_questionnaire_ids.questionnaire_reply,
	    contentType: 'application/json',
	    data: JSON.stringify(posted),
	    success: function(body, status, jqXHR)
	    {
		console.log(body);
	    }
	});
	$('#company_questionnaire').find('span').remove();
	company_questionnaire_ids.questionnaire = null;
	company_questionnaire_ids.questionnaire_reply = null;
	$('#company_questionnaire').dialog("close");
    }

    $('#company_questionnaire').dialog({
	modal: true,
	draggable: false,
	resizable: false,
	width: $(window).width() * 0.45,
	height: $(window).height() * 0.7,
	buttons: {
	    "Enregistrer": send_questionnaire_entreprise
	},
	close: function() { $('#company_questionnaire').find('span').remove();
			    company_questionnaire_ids.questionnaire = null;
			    company_questionnaire_ids.questionnaire_reply = null;
			  }
    });

    console.log("REQUEST ENTREPRISE");
    let url = "/questionnaire-entreprise?";
    $.ajax({
	type: 'GET',
	url: url,
	success: function (info) {

	    console.log(info);
	    if (getParameterByName("newquest", window.location.href) == "false")
		url = "/info-entreprise?siret=" + questionnaire_reply.resources[0].companySiret;
	    else if (getParameterByName("newquest", window.location.href) == "true")
		url = "/info-entreprise?siret=" + getCookie("entreprise_siret");

	    $.ajax({
	     	type: 'GET',
	     	url: url,
		success: function (data) {
		    console.log(data);
		    company_questionnaire_ids.questionnaire = info.id;
		    company_questionnaire_ids.questionnaire_reply = data.resources[0].id;
		    set_questionnaire_entreprise(info, data);
		}
	     });
	}
    });
}

$(document).ready(function()
		  {
		      $("#inputfile").change(function()
					     {
						 console.log("AAAAAAAHHH")
						 readURL(this);
					     });

		      $("#inputfile2").change(function()
					     {
						 readURL2(this);
					     });

		      $('#btninputfile2').on('click', function()
					    {
						$('#inputfile').click();
					    });

		      $('#meeting').on('click', function()
				       {
					   window.location.replace('/meeting_list');
				       });

		      $panneaux = $('div.panneau').hide();

		      $("#top > img").click(function()
					    {
						window.location.replace("/meeting_list");
					    });

		      $("#save").on('click', send_questionnaire); //send questions to the server (BDD)
		      $('#list').on('click focus focusin focusout blur', parse_display);
		      $('#list').on('click', '.cityclose' ,cityclose_button_event);
		      $('#list').on('click', '.citycheck' ,citycheck);
		      $('#list').on('keydown', '.city' ,check_input_city);

		      /* Recuperation des fiches conseil */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/advice_sheet",
			      dataType: "json",
			      success : (function(data)
					 {
					     advice = data;
					     loadcons(data, '#conseil');
					 }),
			      error : (function(data)
				       {
					   alert("Une erreur est arrivée: les fiches conseil ne sont pas disponibles pour le moment.");
				       }),
			  });

		      /* Recuperation des fiches produit */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/product_sheet",
			      dataType: "json",
			      success : (function(data)
					 {
					     product = data;
					     loadprod(data, '#produit');
					 }),
			      error : (function(data)
				       {
					   alert("Une erreur est arrivée: les fiches conseil ne sont pas disponibles pour le moment.");
				       }),
			  });

		      /* Fiche aide: selection projet */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/valid_domains",
			      dataType: "json",
			      success : (function(data)
					 {
					     fillfield("#projet", data);
					 }),
			      error : (function(data)
				       {
					   alert("Une erreur est arrivée: les infos projet ne sont pas disponibles pour le moment.");
				       }),
			  });

		      /* Fiche aide: selection projet */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/valid_means",
			      dataType: "json",
			      success : (function(data)
					 {
					     fillfield("#interv", data);
					 }),
			      error : (function(data)
				       {
					   alert("Une erreur est arrivée: les infos moyen interv ne sont pas disponibles pour le moment.");
				       }),
			  });

		      /* Fiche aide: selection filières */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/valid_industries",
			      dataType: "json",
			      success : (function(data)
					 {
					     fillfield("#filiere", data);
					 }),
			      error : (function(data)
				       {
					   alert("Une erreur est arrivée: les infos filières ne sont pas disponibles pour le moment.");
				       }),
			  });

		      /* Recuperation du materiel de compte rendu */
		      $.ajax(
			  {
			      type: "GET",
			      url: "/report-templates",
			      dataType: "json",
			      success : (function(data)
					 {
					     report_temp = data;
					     compte_rendu(data);
					 }),
			      error : (function(data)
				       {
					   console.log(data);
					   fail_compte_rendu(data);
				       }),
			  });

		      if (getParameterByName("newquest", window.location.href) == "false")
		      {
			  $.ajax(
			      {
				  type: "GET",
				  url: "/report",
				  dataType: "json",
				  success : (function(data)
					     {
						 report = data;
					     }),
				  error : (function(data)
					   {
					       console.log(data);
					   }),
			      });
		      }

		      /* Récupère les infos nécéssaires à l'affichage de la page dans les cookies */
		      let data = "";

		      if (data = getCookie("infomet"))
					//infomet contient les champs du la ligne selectionnée de la liste des entretiens(théme , campany , advisor , questions , reponses )
		      {
			  data = JSON.parse(data); //creer json string from javascript object
			  getquest(data); //on envoie la data pour recupérer le questionnaire correspand au théme
		      }
		      else
		      {
			  window.location.replace("/meeting_list");
		      }

		      if (getParameterByName("newquest", window.location.href) == "true") {
			  openDialog('dia',this);
		      }

		      $('.cptrd').click(function()
					{
					    if (getParameterByName("newquest", window.location.href) == "true" || questionnaire_reply.resources[0].validatedP == false)
					    {
						validatedP = true;
						send_questionnaire(2);
					    }
					    if (typeof advice !== 'undefined')
					    {
						$('#selectedcons > *').remove();
						update_cptrd_cons(advice);
						$('#selectedprod > *').remove();
						update_cptrd_prod(product);
						$('#selectedhelp > *').remove();
						update_cptrd_help(help);
						//			parse_questionnaire(questions, get_values(), '#listrendu');
					    }
					    else
					    {
						console.log("shiiiet");
					    }
					});

		  });

function	getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var	ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++)
    {
	var c = ca[i];
	while (c.charAt(0) == ' ')
	{
	    c = c.substring(1);
	}
	if (c.indexOf(name) == 0)
	{
	    return c.substring(name.length, c.length);
	}
    }
    return "";
}

/* Lightboxes' function. */
function openDialog(dialogId,lastFocused)
{
    function check_form()
    {
			//récuperer les valeurs des champs de la boite de dialogue de l'interlocuteur
	let data = [ $('#DialogNom').val(),
		     $('#DialogPrenom').val(),
		     $('#DialogMail').val(),
		     $('#DialogDate').val() ];
	for (let i = 0; i < data.length; ++i)
	{
	    if (data[i].length == 0)
			// alert("veuillez saisir les champs vides"); se bloque aprés meeme si on a rempli tous les champs.??
		return (false);
	}
	return (true);
    }


    var dialog = document.getElementById(dialogId);
    var heading = dialog.querySelector("h1"); //return the first element in the document with class="h1"
		// alert("aaaa" +heading); ==> retourne null !!

	  if (!lastFocused)
	var lastFocused = document.activeElement;

    dialog.style.display = "block";

    function focusToDialog(ev){
	var tmp = ev.target.parentNode;
	while (tmp)
	{
	    if (tmp == dialog) return;
	    tmp = tmp.parentNode;
	}
    }
    document.addEventListener("focus",focusToDialog,true);

    var children = document.getElementsByTagName("body")[0].children;
    var hiddens = [];

    for (var i=0,el;el=children[i];i++)
    {
	if (el != dialog){

	    var ob = {};

	    if (el.hasAttribute("aria-hidden"))
	    {
		ob.ariaHidden = el.getAttribute("aria-hidden");
	    }
	    el.setAttribute("aria-hidden","true");

	    ob.el = el;
	    hiddens.push(ob);
	}
    }

    var closeButton = dialog.querySelector(".closebutton");

    closeButton.addEventListener("click",closeDialog);
    dialog.addEventListener("keydown",function(ev)
			    {
				if(ev.key.slice(0,3) == "Esc") closeDialog();
			    });

    dialog.closeDialog = closeDialog;

    function closeDialog(){

	if (check_form() == true)
	{
	    document.removeEventListener("focus",focusToDialog,true);
	    $('#locutor').val($('#DialogPrenom').val() + " " + $('#DialogNom').val());

	    for (var i=0,ob;ob=hiddens[i];i++)
	    {
		if (ob.ariaHidden){
		    ob.el.setAttribute("aria-hidden",ob.ariaHidden);
		}
		else
		{
		    ob.el.removeAttribute("aria-hidden");
		}
	    }

	    //		lastFocused.focus();
	    dialog.style.display = "none";
	}
    }

    var topFocus = dialog.querySelector(".focus");
    if (!topFocus)
    {
	topFocus = heading; heading.setAttribute("tabindex","0")
    };

    closeButton.addEventListener("keydown",function(ev)
				 {
				     if (ev.key == "Tab" && (!ev.shiftKey))
				     {
					 topFocus.focus();
					 ev.preventDefault();
				     }
				 });

    topFocus.addEventListener("keydown",function(ev)
			      {
				  if (ev.key == "Tab" && (ev.shiftKey))
				  {
				      closeButton.focus();
				      ev.preventDefault();
				  }
			      });
}



function base64ArrayBuffer(arrayBuffer) // convert ArrayBuffer to base64 encoded string
{
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
	// Combine the three bytes into a single integer
	chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

	// Use bitmasks to extract 6-bit segments from the triplet
	a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
	b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
	c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
	d = chunk & 63               // 63       = 2^6 - 1

	// Convert the raw binary segments to the appropriate ASCII encoding
	base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
	chunk = bytes[mainLength]

	a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

	// Set the 4 least significant bits to zero
	b = (chunk & 3)   << 4 // 3   = 2^2 - 1

	base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
	chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

	a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
	b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

	// Set the 2 least significant bits to zero
	c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

	base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}
