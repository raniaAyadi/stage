

//retourne true or false
function	equal_to(a, b)
{
    if (a == b)
	return (true);
    return (false);
}

function	not_equal_to(a, b)
{
    if (a != b)
	return (true);
    return (false);
}

function	greater_than(a, b)
{
    if (a > b)
	return (true);
    return (false);
}

function	less_than(a, b)
{
    if (a < b)
	return (true);
    return (false);
}

function	greater_than_or_equal(a, b)
{
    if (a >= b)
	return (true);
    return (false);
}

function	less_than_or_equal(a, b)
{
    if (a <= b)
	return (true);
    return (false);
}

//ici on donne la condition (true or false) et l'id du question pour verifier l'affichage
function	check_condition(condition_value, id)
{
    if (condition_value == true)
	$('#display-' + id).removeAttr('hidden'); //le question sera afficher
    else
	$('#display-' + id).attr('hidden', ""); //sinon on le cache
}

// ici selon la comparaison de la variable de champ displayconditions et variableglobal[displayconditions] on affiche ou pas la question
function	parse_display()
{
    get_rules("quest"); //on traite les régles des questions
    for (let i = 0; display[i] != undefined; ++i)
    {
	if (display[i].condition[0] == "=")
	{
	    check_condition(equal_to(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "!=")
	{
	    check_condition(not_equal_to(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == ">")
	{
	    check_condition(greater_than(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "<")
	{
	    check_condition(less_than(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == ">=")
	{
	    check_condition(greater_than_or_equal(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "<=")
	{
	    check_condition(less_than_or_equal(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}

    }
}
