/* Check Siret */
function check_siret(code) {
	var len = code.length
	var parity = len % 2
	var sum = 0
	for (var i = len-1; i >= 0; i--) {
	var d = parseInt(code.charAt(i))
	if (i % 2 == parity) { d *= 2 }
	if (d > 9) { d -= 9 }
	sum += d
	}
	return sum % 10
}
/* récupère le type d'industrie en fonction de la valeur reçu */
function	IndustryType(nb)
{
	const sector_list = [ "undefined",
			  "Activités alimentaires",
			  "Activités agroalimentaires",
			  "Bois papier carton",
			  "BTP construction",
			  "Commerce",
			  "Electronique",
			  "Equipement industriel",
			  "Fabrication, production",
			  "Hotel, café, restaurant",
			  "Informatique",
			  "Mécanique",
			  "Médical",
			  "Service à la personne",
			  "Service aux entreprises",
			  "TIC",
			  "Autre" ];
	for (let i = 0; i < 17; i++)
	{
	    if (i == nb)
		return (sector_list[i]);
	}
	return ("error");
}

function	set_themes(themes)
{
	let	i = 0;
	let	j = 0;
	let	k;
	let	toAppend = [];
	toAppend[j] = '<option value="0" disabled> Type de diagnostic </option>';
	++j;
	while (themes.resources[i] != undefined)
	{
		k = 0;
		while (themes.resources[i].themes[k] != undefined)
		{
		    toAppend[j] = '<option value="' + themes.resources[i].themes[k].questionnaire.resource + ';' + themes.resources[i].name;
		    if (themes.resources[i].themes[k].name != null)
		   	toAppend[j] += ' - ' + themes.resources[i].themes[k].name;
		    toAppend[j] += '">' + themes.resources[i].name;
		    if (themes.resources[i].themes[k].name != null)
			toAppend[j] += ' - ' + themes.resources[i].themes[k].name;
		    toAppend[j] += '</option>';
				// http://www.beenov.fr/core/v1/theme-groups?session-key=7DC304F2-726A-431D-9762-7BC2220D8C89
			++k;
			++j;
		}
		++i;
	}
	console.log(toAppend);
	//toAppend = toAppend.join();
	$('#diag').append(toAppend);
}

/* Set la date pour le tri croissant/décroissant */
function	invert_date(date)
{
	let	pieces = date.split('/');
	pieces.reverse();
	return (pieces.join('-'));
}


/* Rempli tableau des données */
function	set_data(list)
{
	let DataSet = [];
	let i = 0;
	console.log(list);
	for (; list[i] != undefined ; i++)
	{
	DataSet[i] = [ list[i].themeGroupName + " - " + list[i].themeName, //Thématique
			   list[i].companySiret, //Siret
			   list[i].companyName, //Entrerpsie
			   list[i].companyNafCode, //Code NAF
			   IndustryType(list[i].companyIndustry), //Secteur d'activité
			   list[i].companyWorkforce, //Effectif
			   list[i].ownerName, //conseiller
			   invert_date(list[i].date), //date
			   list[i].questionnaire.resource, //Chemin questionnaire
			   list[i].questionnaireReply.resource ]; // Réponses questionnaire
	}
	return (DataSet);
}


function	siret_data(e)
{
    console.log(e.keyCode);
    console.log(e.ctrlKey);
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	// Allow: Ctrl+A
	(e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
	// Allow: Ctrl+C
	(e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
	// Allow: Ctrl+V
	(e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true)) ||
	// Allow: Ctrl+X
	(e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
	// Allow: home, end, left, right
	(e.keyCode >= 35 && e.keyCode <= 39) ||
	//Allow numbers and numbers + shift key
	((e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) || (e.keyCode >= 96 && e.keyCode <= 105))) {
	// let it happen, don't do anything
	return;
    }
    // Ensure that it is a number and stop the keypress
    if ((!e.shiftKey && (e.keyCode < 48 || e.keyCode > 57)) || (e.keyCode < 96 || e.keyCode > 105)) {
	e.preventDefault();
    }

}

/* To create a new meeting -> drives to the company page */
function	create_button()
{
    console.log( $('#diag').val());
    if (siret.length != 14 || check_siret(siret) != 0)
    {
	alert("Saisissez un SIRET");
    }
    else
    {
	window.location.replace('/company?siret=' + siret + '&questionnaire=' +  $('#diag').val().split(';')[0] + '&theme=' + $('#diag').val().split(';')[1]);
	}
}

function	openQuestionnaire(data)
{

    let json = {
	theme:data[0], //Thématique
	company: data[2], //Nom de l'entreprise
	advisor: data[6], //le Conseiller
	quest: data[8], // les questions qui sont relié au Thématique (quest = /questionnaire/id)
	questRep: data[9] //les réponses des questions
    };
    json = JSON.stringify(json); //create JSON string from a javascript object
    console.log(json);
    document.cookie = "infomet=" + json;  //stocker dans cookies
    window.location.replace("/questionnaire?newquest=false"); //redirection à la page questionnaire.html
}

/* To send a meeting to another adviser */
function	transfert(tableau)
{
    openDialog('dia',this, 0);
    $.ajax(
	{
	    type: "GET",
	    url : "/get_users",
	    dataType: "json",
	    success : function(data)
	    {
		console.log(data)
		let toAppend = [];
		let i;
		for (i = 0; i < data.length; i++)
		{
		    toAppend[i] += '<option value="' + data[i]['lastName'] + " " + data[i]['firstName'] + " " + data[i]['id'] + '">' + data[i]['lastName'] + " " + data[i]['firstName'] + '</option>';
		}
		toAppend = toAppend.sort();
		toAppend = toAppend.join();
		$('#adviser').append(toAppend);
	    }
	});
    $('#newadv').click(function()
		       {
			   let idMeeting = tableau.rows({selected:true}).data()[0][8]; //getQueryVariable('met');
			   let idQuest = tableau.rows({selected:true}).data()[0][9]; //getQueryVariable('qst')


			   let user = /*$('#adviser').value;*/ document.getElementById("adviser");
			   user = user.options[user.selectedIndex].value;
			   console.log(user);


			   if (idMeeting && user && idQuest)
			   {
			       idMeeting = idMeeting.split('/')[1]
			       user = user.split(' ')[lastword(user)];
			       console.log(user);
			   }
			   /* requete POST & redirection meeting_list */
			   let target = "users/" + user;
			   let data = {'owner' : {'resource' : target, 'idmet' : idQuest}};
			   console.log(data);
			   $.ajax(
			       {
				   type: 'POST',
				   url : '/givemeeting',
				   data: data,
				   dataType: "json",
				   success : (function(html, textStatus, jqXHR)
					      {
						  tableau.rows( { selected : true } ).remove().draw(false);
						  alert("L'entretien à été transféré.");
						  openDialog('dia',this, 1)
					      }),
				   error : (function(texte, code, item)
					    {
						alert("Une erreur inattendue à empêché le trasfert de l'entretien");
					    }),
			       });
		       });
}

/* get the user's ID. For transfert() function */
function lastword(user)
{
    var i = 0;
    var word = 0;

    while (user[i])
    {
	if (user[i] == ' ')
	{
	    word += 1;
	}
	i += 1;
    }
    return (word);
}
//array = string.split(' ');
//array = array[length - 1]

/* To generate a CSV file out of a meeting */
function	exportgrc(tableau)
{
    let qstReply = tableau.rows({selected:true}).data()[0][9];
    $.ajax(
	{
	    type: 'POST',
	    url: '/exportGRC',
	    data: {"questionnaire-reply" : {'resource' : qstReply}},
	    success: function(body, textStatus, jqXHR)
	    {
		let companyname = tableau.rows({selected:true}).data()[0][2];
		let toAppend = '<p id="recupGRC">GRC de ' + companyname + ' généré.<br /><a class="link" href="' + body.url + '" style="color:#006699">Récupérer le GRC</a></p>';
		$('#deroulant').append(toAppend);
	    },
	    error: function(texte, code, item)
	    {
		alert("Une erreur est survenue.");
	    },
	});
}

/* To delete one meeting from the database */
function	deletemet(tableau)
{
    if (confirm("Voulez vous vraiment supprimer cet entretien?"))
    {
	let qstReply = tableau.rows({selected:true}).data()[0][9];
	$.ajax(
	    {
		type: 'POST',
		url: '/delete',
		data: {"whatever" : '_', "qst" : qstReply},
		success: function(body, textStatus, jqXHR)
		{
		    tableau.rows( { selected : true } ).remove().draw(false);
		    alert("Entretien supprimé avec succès.");
		},
		error: function(texte, code, item)
		{
		    alert("Une erreur est survenue lors de la suppression de l'entretien.");
		},
	    });
    }
}

$(document).ready(function()
		  {
		      $('#siret_data').keypress(function(event){

			  if (event.keyCode === 10 || event.keyCode === 13)
			  {
			      let siret = $('#siret_data')[0].value;
			      if (siret.length != 14 || check_siret(siret) != 0)
			      {
				  alert("Saisissez un SIRET");
			      }
			      else
			      {
				  window.location.replace('/company?siret=' + siret + '&questionnaire=' +  $('#diag').val().split(';')[0] + '&theme=' + $('#diag').val().split(';')[1]);
			      }
			      event.preventDefault();
			  }
		      });

		      $.ajax(
			  { /* liste des thèmes */
			      type: "GET",
			      url: "themes",
			      dataType: "json",
			      success : function(data)
			      {
				  set_themes(data);
			      }
			  });


		      /* Création entretien */
		      $('#create_button').click(function()
						{
						    create_button();
						});


		      $.ajax(
			  { /* requète GET pour récupérer infos entretiens */
			      type: "GET",
			      url : "get_meeting_list",
			      dataType: "json",
			      success : function(data)
			      {
				  /* Création tableau avec paramètres */
				  var tableau = $('#meetings').DataTable(
				      {
					  "data" : set_data(data),
					  "columns": [
					      { title: "Thématique" },
					      { title: "SIRET" },
					      { title: "Entreprise" },
					      { title: "Code NAF" },
					      { title: "Secteur d'activité" },
					      { title: "Effectif" },
					      { title: "Conseiller" },
					      { type: "date", title: "Date"},
					      { visible : false, searchable : false},
					      { visible : false, searchable : false} ],
					  "scrollY":	"58vh",
					  "scrollX":	true,
					  "paging":	false,
					  "bFilter":	false,
					  "searching":	true,
					  "dom":		't',
					  "select" :	'single'
				      });

				  /* Seulement des nombres dans input SIRET */
				  $("#siret_data").on('keydown', function (e)
						      {
							  siret_data(e);
						      });

				  /* Recherche dans le tableau */
				  $("#searchinput").on('keyup', function(event)
						       {
							   tableau.search(this.value).draw();
						       });

				  /* Ouverture entretien */
				  $('#open').click(function()
						   {
						       let data = tableau.rows( { selected: true } ).data();
						       openQuestionnaire(data[0]);
						   });

				  $('#transfert').click(function()
							{
							    transfert(tableau);
							});

				  $('#exportgrc').click(function()
							{
							    exportgrc(tableau);
							});

				  $('#delete').click(function()
						     {
							 deletemet(tableau);
						     });
			      }
			  });
		  });

/* Lightboxes' function. */
function openDialog(dialogId,lastFocused, id)
{
    if (id == 1)
    {
	closeDialog()
	return (0);
    }

    var dialog = document.getElementById(dialogId);
    var heading = dialog.querySelector("h1");
    if(!lastFocused) var lastFocused = document.activeElement;

    dialog.style.display = "block";
    //	heading.focus();

    function focusToDialog(ev){
	var tmp = ev.target.parentNode;
	while(tmp){
	    if(tmp == dialog) return;
	    tmp = tmp.parentNode;
	}
	//		heading.focus();
    }
    document.addEventListener("focus",focusToDialog,true);

    var children = document.getElementsByTagName("body")[0].children;
    var hiddens = [];

    for(var i=0,el;el=children[i];i++){
	if(el != dialog){

	    var ob = {};

	    if(el.hasAttribute("aria-hidden")){
		ob.ariaHidden = el.getAttribute("aria-hidden");
	    }
	    el.setAttribute("aria-hidden","true");

	    ob.el = el;
	    hiddens.push(ob);
	}
    }

    var closeButton = dialog.querySelector(".close");

    closeButton.addEventListener("click",closeDialog);
    dialog.addEventListener("keydown",function(ev){if(ev.key.slice(0,3) == "Esc") closeDialog();});

    dialog.closeDialog = closeDialog;

    function closeDialog(){

	document.removeEventListener("focus",focusToDialog,true);

	for(var i=0,ob;ob=hiddens[i];i++){
	    if(ob.ariaHidden){
		ob.el.setAttribute("aria-hidden",ob.ariaHidden);
	    }else{
		ob.el.removeAttribute("aria-hidden");
	    }
	}

	lastFocused.focus();
	dialog.style.display = "none";
    }

    var topFocus = dialog.querySelector(".focus");
    if(!topFocus) {topFocus = heading; heading.setAttribute("tabindex","0")};

    closeButton.addEventListener("keydown",function(ev){
	if(ev.key == "Tab" && (!ev.shiftKey)){
	    topFocus.focus();
	    ev.preventDefault();
	}
    });

    topFocus.addEventListener("keydown",function(ev){
	if(ev.key == "Tab" && (ev.shiftKey)){
	    closeButton.focus();
	    ev.preventDefault();
	}
    });
}
