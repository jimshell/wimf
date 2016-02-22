Template.main.events({
	'click .linkback': function(e) {
		return history.back();
	}
});



Template.myfood.events({
	'submit form[name="addfood"]': function(e) {
		e.preventDefault();
		Meteor.call('insertFood', $('#item', $(e.target)).val(), $('#tags', $(e.target)).materialtags('items'));
		$(e.target)[0].reset();
		$('#tags', $(e.target)).materialtags('removeAll');

		return false;
	},
	'keypress input[type="text"]': function(e) {
		if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
			$(e.target).closest('form').submit();
		}
	},
	'keyup #search': function(e) {
		var term = $(e.target).val();
		$('.collection-item').removeClass('noshowTerm');

		if (!term) { return; };

		return $(['.collection-item:not([data-label*="', term, '"])'].join('')).addClass('noshowTerm');
	},
	'change select.showfood': function(e) {
		var tag = $(e.target).val();

		$('.collection-item').removeClass('noshowTag');

		if (tag=='AllItems') { return; };

		return $(['.collection-item:not([data-tags*="', tag, '"])'].join('')).addClass('noshowTag');
	},
	'click .shortOfItem': function(e) {
		Meteor.call('updateFood', $(e.target).closest('.btn').data("item"), {'in_fridge':false});
	},
	'click .gotItem': function(e) {
		Meteor.call('updateFood', $(e.target).closest('.btn').data("item"), {'in_fridge':true});
	},
	'click .deleteItem': function(e) {
		Meteor.call('deleteFood', $(e.target).closest('.btn').data("item"));
	}
});


var recipeParser = {
	'allrecipes': function(res) {
		var result = {};

		var doc = $(res);
		result.tit = doc.find('h1[itemprop="name"]').html();
		result.dat = [];
		result.dat[0] = doc.find('time[itemprop="prepTime"]').text();
		result.dat[1] = doc.find('time[itemprop="cookTime"]').text();
		result.dat[2] = doc.find('p.subtext:contains("Original recipe yields")').text().match(/\d+/)[0];

		result.ing = doc.find('span[itemprop="ingredients"]').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();
		result.ste = doc.find('span.recipe-directions__list--item').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();

		return result;
	},
	// 'foodnetwork': function(res) {
	// 	var result = {};

	// 	var doc = $(res);
	// 	result.tit = doc.find('h1[itemprop="name"]').html() || '';
	// 	result.dat = [];
	// 	result.dat[0] = doc.find('dt:contains("Prep:")').next('dd').text();
	// 	result.dat[1] = doc.find('dt:contains("Cook:")').next('dd').text();
	// 	result.dat[2] = '';

	// 	result.ing = doc.find('li[itemprop="ingredients"] .box-block').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();
	// 	result.ste = doc.find('div[itemprop="recipeInstructions"] p').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();

	// 	return result;
	// },
	// 'thekitchn': function(res) {
	// 	var result = {};

	// 	var doc = $(res);
	// 	result.tit = doc.find('h1[itemprop="name"]').html();
	// 	result.dat = [];
	// 	result.dat[0] = doc.find('time[itemprop="prepTime"]').text();
	// 	result.dat[1] = doc.find('time[itemprop="cookTime"]').text();
	// 	result.dat[2] = doc.find('p.subtext:contains("Original recipe yields")').text().match(/\d+/)[0];

	// 	result.ing = doc.find('span[itemprop="ingredients"]').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();
	// 	result.ste = doc.find('span.recipe-directions__list--item').map(function(i,e) {if($(e).text()!='') return $(e).text()}).toArray();

	// 	return result;
	// }
}

Template.myrecipes.events({
	'submit form[name="addrecipe"]': function(e) {
		e.preventDefault();

		var name 		= $('#title', $(e.target)).val();
		var data 		= $('#data input').map(function(i, e) { if ($(e).val()) return $(e).val(); }).toArray();
		var ingredients = $('#ingredients input').map(function(i, e) { if ($(e).val()) return $(e).val(); }).toArray();
		var process 	= $('#process input').map(function(i, e) { if ($(e).val()) return $(e).val(); }).toArray();
		var tags 		= $('#tags', $(e.target)).materialtags('items');
		var sharelevel 	= $('select.sharelevel', $(e.target)).val();

		// console.log(name, data, ingredients, process, tags, sharelevel);

		Meteor.call('insertRecipe', name, data, ingredients, process, tags, sharelevel);

		$(e.target)[0].reset();
		$('#tags', $(e.target)).materialtags('removeAll');

		return false;
	},
	// 'keypress input[type="text"]': function(e) {
	// 	if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
	// 		$(e.target).closest('form').submit();
	// 	}
	// },
	'keyup #search': function(e) {
		var term = $(e.target).val();
		$('.collection-item').removeClass('noshowTerm');

		if (!term) { return; };

		return $(['.collection-item:not([data-label*="', term, '"])'].join('')).addClass('noshowTerm');
	},
	'change select#importfrom': function(e) {
		var site = $(e.target).val();

		var exampleURLs = {
			'allrecipes':'http://allrecipes.com/recipe/55860/baked-garlic-parmesan-chicken/',
			'foodnetwork':'http://www.foodnetwork.com/recipes/packages/comfort-foods/slow-cooker-meals/easy-slow-cooker-recipes.page-1.html',
			'thekitchn':'http://allrecipes.com/recipe/55860/baked-garlic-parmesan-chicken/',
		}

		if (site !== '') {
			$('span#fromsite').html([site,'.com'].join(''));
			$('img.modim').attr('src', ['/images/', site,'.gif'].join(''));
			$('#importurl').attr('value', exampleURLs[site]);
			$('#importmodal').openModal();
		}
	},
	'change select.showrecipe': function(e) {
		var tag = $(e.target).val();

		$('.collection-item').removeClass('noshowTag');

		if (tag=='AllItems') { return; };

		return $(['.collection-item:not([data-tags*="', tag, '"])'].join('')).addClass('noshowTag');
	},
	'click #doimport': function(e) {
		$('#loadingimport').addClass('active');

		Meteor.call('fetchRecipe', $('#importurl').val(), function(err, res) {

			var site = $('#importfrom').val();

			var final = recipeParser[site](res);

			Meteor.call('insertRecipe', final.tit, final.dat, final.ing, final.ste, [], 'private');

			$('#loadingimport').removeClass('active');
			$('#importmodal').closeModal();
			$('#importfrom').prop('selectedIndex', 0);
		});
	},
	'click #addingredient': function(e) {
		$('#ingredients').append($('<input type="text" class="validate" placeholder="Add ingredient!">'));
	},
	'click #addstep': function(e) {
		$('#process').append($('<input type="text" class="validate" placeholder="Add cooking step!">'));
	},
	'click .deleteRecipe': function(e) {
		Meteor.call('deleteRecipe', $(e.target).closest('.btn').data("id"));
	}
});


Template.whattocook.events({
	'keyup #search': function(e) {
		var term = $(e.target).val();
		$('.collection-item').removeClass('noshowTerm');

		if (!term) { return; };

		return $(['.collection-item:not([data-label*="', term, '"])'].join('')).addClass('noshowTerm');
	},
	'change select.showfood': function(e) {
		var tag = $(e.target).val();

		$('.collection-item').removeClass('noshowTag');

		if (tag=='AllItems') { return; };

		return $(['.collection-item:not([data-tags*="', tag, '"])'].join('')).addClass('noshowTag');
	},
	'click #snif': function(e) {
		$(e.target).prop('checked')
		  && $('#ingredients').removeClass('soif')
		  || $('#ingredients').addClass('soif');
	},
	'click #allmandatory': function(e) {
		Template.whattocook.suggested_recipesDeps.changed();
	},
	'click input[data-label]': function(e) {
		if ($(e.target).prop('checked')) {
			$('#ilist').materialtags('add', $(e.target).data('label'))
		} else {
			$('#ilist').materialtags('remove', $(e.target).data('label'));
		}

		Template.whattocook.suggested_recipesDeps.changed();
	},
	'click .chip i[data-role="remove"]': function(e) {
		var dl = $(e.target).closest('.chip').contents().filter(function(){ return this.nodeType == 3; })[0].nodeValue;

		$(['input[data-label="', dl,'"]'].join('')).click();
	},
});
