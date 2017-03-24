'use strict';

var React = require('react');
var Component = React.Component;

var katexStyle = require('katex/dist/katex.min.css');
var katex = require('katex');

var md = require('markdown-it')().disable(['image']);

if (undefined !== mermaid && null !== mermaid) {
	mermaid.initialize({
		startOnLoad: true
	});
}

var YAMDRenderer = React.createClass({
	displayName: 'YAMDRenderer',

	mdRenderAsync: function mdRenderAsync(source) {
		return new Promise(function (resolve, reject) {
			resolve(md.render(source));
		});
	},
	imgSubstituteToRenderableAsync: function imgSubstituteToRenderableAsync(content, previewableImageList) {
		var widgetRef = this;
		var props = widgetRef.props;

		if (!previewableImageList || 0 >= previewableImageList.length) {
			return new Promise(function (resolve, reject) {
				resolve(content);
			});
		}

		var regex = new RegExp('\!\{' + props.imgTag + '\}\%(\\d+)\%', 'g');
		var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			if (typeof previewableImageList[param1] != 'undefined') {
				var src = previewableImageList[param1].src;
				var replacementTag = "<img style='display: block; width: 100%; object-fit: contain;' src='" + src + "'/>";
				return replacementTag;
			} else {
				return match;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	videoSubstituteToRenderableAsync: function videoSubstituteToRenderableAsync(content, previewableVideoList) {
		var widgetRef = this;
		var props = widgetRef.props;

		if (!previewableVideoList || 0 >= previewableVideoList.length) {
			return new Promise(function (resolve, reject) {
				resolve(content);
			});
		}

		var regex = new RegExp('\!\{' + props.videoTag + '\}\%(\d+)\%', 'g');
		var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			if (typeof previewableVideoList[param1] != 'undefined') {
				var src = previewableVideoList[param1].src;
				var replacementTag = ["<video width='100%' controls>", "<source src='" + src + "'>", "</video>"].join('\n');
				return replacementTag;
			} else {
				return match;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	ktxSubstituteToRenderableAsync: function ktxSubstituteToRenderableAsync(content, disabled) {
		var widgetRef = this;
		var props = widgetRef.props;

		if (true == disabled) return new Promise(function (resolve, reject) {
			resolve(content);
		});
		var regex = new RegExp('\!\{' + props.ktxTag + '\}\%([^%]+)\%', 'g');
		var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				var toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				var replacementTag = katex.renderToString(toRenderParam);
				return replacementTag;
			} catch (err) {
				return param1;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	alnctrContentSubmittableToRenderableAsync: function alnctrContentSubmittableToRenderableAsync(content) {
		var widgetRef = this;
		var props = widgetRef.props;

		var regex = new RegExp('\!\{' + props.alignCenterTag + '\}\%([^%]+)\%', 'g');
		var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				var toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				var strongRegex = /<strong>([\s\S]+)<\/strong>/g;
				var tmp = toRenderParam.replace(strongRegex, "<span style=\'font-weight: bold; font-size: 24px;\'>$1</span>");
				var replacementTag = "<div style=\'width: 100%; text-align: center;\'>" + tmp + "</div>";
				return replacementTag;
			} catch (err) {
				return param1;
			}
		});
		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	generateRandomMermaidId: function generateRandomMermaidId(idxOfRegExpTraversal) {
		return "mermaid-" + idxOfRegExpTraversal;
	},
	mermaidSubstituteToRenderableAsync: function mermaidSubstituteToRenderableAsync(content, disabled) {
		var widgetRef = this;
		var props = widgetRef.props;

		if (true == disabled) return new Promise(function (resolve, reject) {
			resolve(content);
		});

		var newMermaidSubstituteResidualList = [];
		var idxOfRegExpTraversal = 0;

		var regex = new RegExp('\!\{' + props.mermaidTag + '\}\%([^%]+)\%', 'g');
		var newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				var assignedId = widgetRef.generateRandomMermaidId(idxOfRegExpTraversal);
				var toSave = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				newMermaidSubstituteResidualList.push({
					id: assignedId,
					graph: toSave
				});
				var replacementTag = "<div id='" + assignedId + "' class='mermaid'>" + param1 + "</div>";
				return replacementTag;
			} catch (err) {
				return param1;
			} finally {
				++idxOfRegExpTraversal;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve({
				content: newContent,
				substitueResidualList: newMermaidSubstituteResidualList
			});
		});
	},
	getInitialState: function getInitialState() {
		var widgetRef = this;
		var props = widgetRef.props;
		return {
			dangerousInnerHTML: "",
			mermaidSubstituteResidualList: []
		};
	},
	renderWithWholePipelineAsync: function renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid) {
		var widgetRef = this;
		var props = widgetRef.props;
		return widgetRef.mdRenderAsync(source).then(function (newSource) {
			return widgetRef.imgSubstituteToRenderableAsync(newSource, previewableImageList);
		}).then(function (newSource) {
			return widgetRef.videoSubstituteToRenderableAsync(newSource, previewableVideoList);
		}).then(function (newSource) {
			return widgetRef.ktxSubstituteToRenderableAsync(newSource, disableTeX);
		}).then(function (newSource) {
			return widgetRef.alnctrContentSubmittableToRenderableAsync(newSource);
		}).then(function (newSource) {
			return widgetRef.mermaidSubstituteToRenderableAsync(newSource, disableMermaid);
		}).then(function (rendered) {
			return new Promise(function (resolve, reject) {
				widgetRef.setState({
					mermaidSubstituteResidualList: rendered.substitueResidualList,
					dangerousInnerHTML: rendered.content
				}, function () {
					resolve(true);
				});
			});
		});
	},
	componentDidMount: function componentDidMount() {
		var widgetRef = this;
		var props = widgetRef.props;
		var source = props.source;
		var previewableImageList = props.previewableImageList;
		var previewableVideoList = props.previewableVideoList;
		var disableTeX = props.disableTeX;
		var disableMermaid = props.disableMermaid;
		widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var widgetRef = this;
		var source = nextProps.source;
		var previewableImageList = nextProps.previewableImageList;
		var previewableVideoList = nextProps.previewableVideoList;
		var disableTeX = nextProps.disableTeX;
		var disableMermaid = nextProps.disableMermaid;
		widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
	},
	render: function render() {
		var widgetRef = this;
		var props = widgetRef.props;
		var style = props.style;

		return React.createElement('div', {
			style: style,
			dangerouslySetInnerHTML: {
				__html: widgetRef.state.dangerousInnerHTML
			}
		}, null);
	},
	componentDidUpdate: function componentDidUpdate() {
		var widgetRef = this;
		var props = widgetRef.props;
		var disableMermaid = props.disableMermaid;
		if (true == disableMermaid) return;
		if (undefined === mermaid || null === mermaid) return;
		mermaid.init(props.mermaidOptions, ".mermaid");
	}
});

YAMDRenderer.propTypes = {
	imgTag: React.PropTypes.string.isRequired,
	ktxTag: React.PropTypes.string.isRequired,
	mermaidTag: React.PropTypes.string.isRequired,

	previewableImageList: React.PropTypes.array,
	previewableVideoList: React.PropTypes.array
};

exports.default = YAMDRenderer;

