'use strict'

const React = require('react');
const Component = React.Component;

const katexStyle = require('katex/dist/katex.min.css');
const katex = require('katex');

var md = require('markdown-it')()
	.disable(['image']);

if (undefined !== mermaid && null !== mermaid) {
	mermaid.initialize({
		startOnLoad: true,
	});
}

const YAMDRenderer = React.createClass({
	mdRenderAsync: function (source) {
		return new Promise(function (resolve, reject) {
			resolve(md.render(source));
		});
	},
	imgSubstituteToRenderableAsync: function (content, previewableImageList) {
		const widgetRef = this;
		const props = widgetRef.props;

		if (!previewableImageList || 0 >= previewableImageList.length) {
			return new Promise(function (resolve, reject) {
				resolve(content);
			});
		}

		const regex = new RegExp('\!\{' + props.imgTag + '\}\%(\\d+)\%', 'g');
		const newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			if (typeof previewableImageList[param1] != 'undefined') {
				const src = previewableImageList[param1].src;
				const replacementTag = "<img style='display: block; width: 100%; object-fit: contain;' src='" + src + "'/>";
				return replacementTag;
			} else {
				return match;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	videoSubstituteToRenderableAsync: function (content, previewableVideoList) {
		const widgetRef = this;
		const props = widgetRef.props;

		if (!previewableVideoList || 0 >= previewableVideoList.length) {
			return new Promise(function (resolve, reject) {
				resolve(content);
			});
		}

		const regex = new RegExp('\!\{' + props.videoTag + '\}\%(\d+)\%', 'g');
		const newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			if (typeof previewableVideoList[param1] != 'undefined') {
				const src = previewableVideoList[param1].src;
				const replacementTag = ["<video width='100%' controls>",
					"<source src='" + src + "'>",
					"</video>"].join('\n');
				return replacementTag;
			} else {
				return match;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	ktxSubstituteToRenderableAsync: function (content, disabled) {
		const widgetRef = this;
		const props = widgetRef.props;

		if (true == disabled) return new Promise(function (resolve, reject) {
			resolve(content);
		});
		const regex = new RegExp('\!\{' + props.ktxTag + '\}\%([^%]+)\%', 'g');
		const newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				const toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				const replacementTag = katex.renderToString(toRenderParam);
				return replacementTag;
			} catch (err) {
				return param1;
			}
		});

		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	alnctrContentSubmittableToRenderableAsync: function (content) {
		const widgetRef = this;
		const props = widgetRef.props;

		const regex = new RegExp('\!\{' + props.alignCenterTag + '\}\%([^%]+)\%', 'g');
		const newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				const toRenderParam = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				let strongRegex = /<strong>([\s\S]+)<\/strong>/g;
				let tmp = toRenderParam.replace(strongRegex, "<span style=\'font-weight: bold; font-size: 24px;\'>$1</span>");
				const replacementTag = "<div style=\'width: 100%; text-align: center;\'>" + tmp + "</div>";
				return replacementTag;
			} catch (err) {
				return param1;
			}
		});
		return new Promise(function (resolve, reject) {
			resolve(newContent);
		});
	},
	generateRandomMermaidId: function (idxOfRegExpTraversal) {
		return "mermaid-" + idxOfRegExpTraversal;
	},
	mermaidSubstituteToRenderableAsync: function (content, disabled) {
		const widgetRef = this;
		const props = widgetRef.props;

		if (true == disabled) return new Promise(function (resolve, reject) {
			resolve(content);
		});

		let newMermaidSubstituteResidualList = [];
		let idxOfRegExpTraversal = 0;

		const regex = new RegExp('\!\{' + props.mermaidTag + '\}\%([^%]+)\%', 'g');
		const newContent = content.replace(regex, function (match, param1, offset, wholeString) {
			try {
				const assignedId = widgetRef.generateRandomMermaidId(idxOfRegExpTraversal);
				const toSave = param1.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\\[rn]/g, '\\n');
				newMermaidSubstituteResidualList.push({
					id: assignedId,
					graph: toSave,
				});
				const replacementTag = "<div id='" + assignedId + "' class='mermaid'>" + param1 + "</div>";
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
				substitueResidualList: newMermaidSubstituteResidualList,
			});
		});
	},
	getInitialState: function () {
		const widgetRef = this;
		const props = widgetRef.props;
		return {
			dangerousInnerHTML: "",
			mermaidSubstituteResidualList: [],
		}
	},
	renderWithWholePipelineAsync: function (source, previewableImageList, previewableVideoList, disableTeX, disableMermaid) {
		const widgetRef = this;
		const props = widgetRef.props;
		return widgetRef.mdRenderAsync(source)
			.then(function (newSource) {
				return widgetRef.imgSubstituteToRenderableAsync(newSource, previewableImageList);
			})
			.then(function (newSource) {
				return widgetRef.videoSubstituteToRenderableAsync(newSource, previewableVideoList);
			})
			.then(function (newSource) {
				return widgetRef.ktxSubstituteToRenderableAsync(newSource, disableTeX);
			})
      .then(function (newSource) {
        return widgetRef.alnctrContentSubmittableToRenderableAsync(newSource);
      })
			.then(function (newSource) {
				return widgetRef.mermaidSubstituteToRenderableAsync(newSource, disableMermaid);
			})
			.then(function (rendered) {
				return new Promise(function (resolve, reject) {
					widgetRef.setState({
						mermaidSubstituteResidualList: rendered.substitueResidualList,
						dangerousInnerHTML: rendered.content,
					}, function () {
						resolve(true);
					});
				});
			});
	},
	componentDidMount() {
		const widgetRef = this;
		const props = widgetRef.props;
		const source = props.source;
		const previewableImageList = props.previewableImageList;
		const previewableVideoList = props.previewableVideoList;
		const disableTeX = props.disableTeX;
		const disableMermaid = props.disableMermaid;
		widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
	},
	componentWillReceiveProps: function (nextProps) {
		const widgetRef = this;
		const source = nextProps.source;
		const previewableImageList = nextProps.previewableImageList;
		const previewableVideoList = nextProps.previewableVideoList;
		const disableTeX = nextProps.disableTeX;
		const disableMermaid = nextProps.disableMermaid;
		widgetRef.renderWithWholePipelineAsync(source, previewableImageList, previewableVideoList, disableTeX, disableMermaid);
	},
	render: function () {
		const widgetRef = this;
		const props = widgetRef.props;
		const style = props.style;

		return React.createElement('div', {
			style: style,
			dangerouslySetInnerHTML: {
				__html: widgetRef.state.dangerousInnerHTML,
			}
		}, null);
	},
	componentDidUpdate: function () {
		const widgetRef = this;
		const props = widgetRef.props;
		const disableMermaid = props.disableMermaid;
		if (true == disableMermaid) return;
		if (undefined === mermaid || null === mermaid) return;
		mermaid.init(props.mermaidOptions, ".mermaid");
	},
});

YAMDRenderer.propTypes = {
	imgTag: React.PropTypes.string.isRequired,
	ktxTag: React.PropTypes.string.isRequired,
	mermaidTag: React.PropTypes.string.isRequired,

	previewableImageList: React.PropTypes.array,
	previewableVideoList: React.PropTypes.array,
};

exports.default = YAMDRenderer;
