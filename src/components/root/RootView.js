goog.provide('todomvc.components.Root.RootView');
goog.require('goog.events.KeyHandler');
goog.require('goog.i18n.MessageFormat');
goog.require('tart.ui.DlgComponent');
goog.require('todomvc.components.Root.RootViewModel');
goog.require('todomvc.components.TodoList.ListView');



/**
 *
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
todomvc.components.Root.RootView = function() {
    this.model = new todomvc.components.Root.RootViewModel();
    goog.base(this);

    this.listView = new todomvc.components.TodoList.ListView();
    this.itemsFormatter = new goog.i18n.MessageFormat(
        '{NUM_ITEMS, selectordinal, ' +
        'one {item left} ' +
        'other {items left}}');
};
goog.inherits(todomvc.components.Root.RootView, tart.ui.DlgComponent);


/**
 * @override
 */
todomvc.components.Root.RootView.prototype.bindModelEvents = function() {
    this.model.listen('update', this.onUpdate, false, this);
};


todomvc.components.Root.RootView.prototype.toggleAll = function() {
    this.model.toggleAll();
};


todomvc.components.Root.RootView.prototype.clearCompleted = function() {
    this.model.clearCompleted();
};


/**
 *
 * @param {goog.events.BrowserEvent} e
 */
todomvc.components.Root.RootView.prototype.createTodo = function(e) {
    if (e.keyCode != goog.events.KeyCodes.ENTER) return;

    var input = this.getChild('.new-todo')[0];

    var title = input.value.trim();

    if (!title) return;

    this.model.addTodo(title);

    input.value = '';
};


todomvc.components.Root.RootView.prototype.render = function(opt_base) {
    goog.base(this, 'render', opt_base);

    this.keyHandler = new goog.events.KeyHandler(this.getChild('.new-todo')[0]);
    this.keyHandler.listen(goog.events.KeyHandler.EventType.KEY, this.createTodo, false, this);
};


todomvc.components.Root.RootView.prototype.onUpdate = function() {
    var hideClearCompletedButton = this.model.uncompletedCount == this.model.items.length;

    this.getChild('strong')[0].textContent = this.model.uncompletedCount;
    this.getChild('.toggle-all')[0].checked = this.model.isCompleted;
    this.getChild('.todo-count')[0].innerHTML = this.templates_items_counter();

    goog.dom.classlist.enable(this.getChild('.footer')[0], 'hidden', this.model.items.length == 0);
    goog.dom.classlist.enable(this.getChild('.main')[0], 'hidden', this.model.items.length == 0);
    goog.dom.classlist.enable(this.getChild('.clear-completed')[0], 'hidden', hideClearCompletedButton);
};


/**
 * @override
 */
todomvc.components.Root.RootView.prototype.templates_base = function() {
    return '<view id="' + this.getId() + '">' +
        this.templates_section() +
        this.templates_footer() +
        '</view>';
};


/**
 * @return {string} Main section template.
 */
todomvc.components.Root.RootView.prototype.templates_section = function() {
    var checked = this.model.isCompleted ? 'checked' : '';


    return '<section class="todoapp">' +
        this.templates_header() +
        '<!-- This section should be hidden by default and shown when there are todos -->' +
        '<section class="main">' +
        '<input class="toggle-all" type="checkbox"' + checked + '>' +
        '<label for="toggle-all">Mark all as complete</label>' +
        this.listView.getPlaceholder() +
        '</section>' +
        this.templates_todo_footer() +
        '</section>';
};


/**
 * @return {string} Header template.
 */
todomvc.components.Root.RootView.prototype.templates_header = function() {
    return '<header class="header">' +
        '<h1>todos</h1>' +
        '<input class="new-todo" placeholder="What needs to be done?" autofocus>' +
        '</header>';
};


todomvc.components.Root.RootView.prototype.templates_items_counter = function() {
    var message = this.itemsFormatter.format({'NUM_ITEMS': this.model.uncompletedCount});

    return '<strong>' + this.model.uncompletedCount + '</strong> ' + message;
};


todomvc.components.Root.RootView.prototype.templates_todo_footer = function() {
    var hidden = this.model.items.length == 0 ? ' hidden' : '';

    return '<footer class="footer ' + hidden + '">' +
        '<span class="todo-count">' + this.templates_items_counter() + '</span>' +
            //'<ul class="filters">' +
            //'<li>' +
            //'<a class="selected" href="#/">All</a>' +
            //'</li>' +
            //'<li>' +
            //'<a href="#/active">Active</a>' +
            //'</li>' +
            //'<li>' +
            //'<a href="#/completed">Completed</a>' +
            //'</li>' +
            //'</ul>' +
        '<button class="clear-completed">Clear completed</button>' +
        '</footer>';
};


/**
 * @return {string} Footer template.
 */
todomvc.components.Root.RootView.prototype.templates_footer = function() {
    return '<footer class="info">' +
        '<p>Double-click to edit a todo</p>' +
        '<p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>' +
        '<p>Created by <a href="http://todomvc.com">you</a></p>' +
        '<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>' +
        '</footer>';
};


todomvc.components.Root.RootView.prototype.events = {
    'click': {
        '.toggle-all': todomvc.components.Root.RootView.prototype.toggleAll,
        '.clear-completed': todomvc.components.Root.RootView.prototype.clearCompleted
    }
};
