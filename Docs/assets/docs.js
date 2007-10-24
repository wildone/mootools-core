var Docs = {
	
	start: function(){
		
		var docRequest = new Ajax({
			method: 'get', 
			async: false,
			autoCancel: true, 
			onComplete: Docs.update,
			isSuccess: function() {
				alert(this.status);
				return (!this.status && location.protocol == "file:" || (this.status >= 200) && (this.status < 300));
			}
		});
		
		var links = $$('#menu a.script');
		var parents = $$('#menu h3');
		
		links.addEvent('click', function(){
			var path = this.get('href').split('#')[1] + '.md';

			docRequest.setURL(path).send();

			parents.removeClass('selected');
			this.getParent('h3').addClass('selected');
		});
		
		var link = $E('#menu a[href=' + window.location.hash + ']') || $E('#menu a');
		link.fireEvent('click');
		
	},
	
	update: function(markdown){
		
		$('docs-wrapper').set('html', Docs.parse(markdown));
		
	},
	
	parse: function(markdown){
		
		var html = ShowDown(markdown);
		
		var temp = new Element('div').set('html', html);
		
		var anchor = (/\{#(.*)\}/);
		
		temp.getElements('h1, h2, h3, h4, h5, h6').each(function(h){
			var matches = h.innerHTML.match(anchor);
			if (matches) h.set('id', matches[1]);
			h.innerHTML = h.innerHTML.replace(anchor, '');
		});
		
		temp.getElement('h1').set('class', 'first');
		
		return temp.innerHTML;
		
	}
	
};

var ShowDown = function(text){
	return new Showdown.converter().makeHtml(text);
};


window.addEvent('domready', Docs.start);