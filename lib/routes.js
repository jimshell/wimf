FlowRouter.route('/', {
	name: 'home',
    // subscriptions: function(params) {
    //     this.register('modules', Meteor.subscribe('modules'));
    // },
    action: function(params) {
		BlazeLayout.render('main', { top: "header", main: "home" });
	}
});


FlowRouter.route('/my-food', {
	name: 'myfood',
    subscriptions: function(params) {
        this.register('food', Meteor.subscribe('food'));
    },
    action: function(params) {
		BlazeLayout.render('main', { top: "header", main: "myfood" });
	}
});


FlowRouter.route('/my-recipes', {
	name: 'myrecipes',
    subscriptions: function(params) {
        this.register('food', Meteor.subscribe('food'));
        this.register('recipes', Meteor.subscribe('recipes'));
    },
    action: function(params) {
		BlazeLayout.render('main', { top: "header", main: "myrecipes" });
	}
});

FlowRouter.route('/recipe/:id', {
	name: 'recipe',
    subscriptions: function(params) {
        this.register('recipes', Meteor.subscribe('recipes'));
    },
    action: function(params) {
		BlazeLayout.render('main', { top: "header", main: "recipe" });
	}
});



FlowRouter.route('/what-to-cook', {
	name: 'whattocook',
    subscriptions: function(params) {
        this.register('food', Meteor.subscribe('food'));
    },
    action: function(params) {
		BlazeLayout.render('main', { top: "header", main: "whattocook" });
	}
});
