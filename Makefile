all: css js

init:
	bower install almond requirejs text jQuery jquery.scrollbar ractive rv

css:
	r.js -o cssIn=css/my-widget.css out=css/my-widget_embed.css

js:
	r.js -o embed.build.js