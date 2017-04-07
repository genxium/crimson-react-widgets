'use strict'

const React = require('react');
const ReactDOM = require('react-dom');

const SinglePicker = require('./SinglePicker').SinglePicker;
const SinglePickerItem = require('./SinglePicker').SinglePickerItem;
const YAMDRenderer = require('./YAMDRenderer').default;

const YAMDEditor = React.createClass({
  getInitialState: function() {
    this._inputRef = null;
    this._previewRef = null;
    return {
      cachedTextToRender: "",
    };
  },
  insertVideoAtCursor: function(videoIdx) {
    const widgetRef = this;
    if (!widgetRef._inputRef) return;
    const props = widgetRef.props;

    const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    const cursorIndex = inputElement.selectionStart;
    const currentValue = widgetRef._inputRef.value;
    const newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.videoTag + "}%" + videoIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  },
  insertImageAtCursor: function(imageIdx) {
    const widgetRef = this;
    if (!widgetRef._inputRef) return;
    const props = widgetRef.props;

    const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    const cursorIndex = inputElement.selectionStart;
    const currentValue = widgetRef._inputRef.value;
    const newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.imgTag + "}%" + imageIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  },
  render: function() {
    const widgetRef = this;
    const props = widgetRef.props;
    const content = props.content; 
    const previewableVideoList = props.previewableVideoList;
    const previewableImageList = props.previewableImageList;
    
    const shouldDisable = props.shouldDisable;
    const sharedIconStyle = props.sharedIconStyle;

    const onContentChangedBridge = props.onContentChangedBridge;

    const shouldHideShortcutBar = (undefined == props.shouldHideShortcutBar || null == props.shouldHideShortcutBar ? true : props.shouldHideShortcutBar);
    const hideVideoPickerWhenListEmpty = (undefined == props.hideVideoPickerWhenListEmpty || null == props.hideVideoPickerWhenListEmpty ? true : props.hideVideoPickerWhenListEmpty);
    const hideImagePickerWhenListEmpty = (undefined == props.hideImagePickerWhenListEmpty || null == props.hideImagePickerWhenListEmpty ? true : props.hideImagePickerWhenListEmpty);

    let videoItemList = [];
    if (undefined !== previewableVideoList && null !== previewableVideoList) {
      for (let i = 0; i < previewableVideoList.length; ++i) {
        const singleVideoItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: (evt) => {
            widgetRef.insertVideoAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableVideoList[i].poster,
          style: {
            height: 64,
            objectFit: 'cover',
          }
        })); 
        videoItemList.push(singleVideoItem);
      }
    }

    const videoPicker = React.createElement(SinglePicker, {
      id: 'video-picker',
      key: 'video-picker',
      title: props.previewableVideoPickerTitle,
      style: {
        display: (hideVideoPickerWhenListEmpty && 0 == videoItemList.length ? 'none' : 'inline-block'),
      }
    }, videoItemList);

    let imageItemList = [];
    if (undefined !== previewableImageList && null !== previewableImageList) {
      for (let i = 0; i < previewableImageList.length; ++i) {
        const singleImageItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: (evt) => {
            widgetRef.insertImageAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableImageList[i].src,
          style: {
            height: 64,
            objectFit: 'cover',
          }
        })); 
        imageItemList.push(singleImageItem);
      }
    }

    const imagePicker = React.createElement(SinglePicker, {
      id: 'image-picker',
      key: 'image-picker',
      title: props.previewableImagePickerTitle,
      style: {
        display: (hideImagePickerWhenListEmpty && 0 == imageItemList.length ? 'none' : 'inline-block'),
      }
    }, imageItemList);

    const mathSampleInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{katex}% \\mathcal{L}(x) = \\sum\\_{lower}^{upper} \\oint\\_{\\partial \\Pi} \\sqrt{r\\_{\\mu}r^{\\nu} + b^2} \\cdot d\\vec{A} %\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.mathIcon);

    const seqDiagramSampleText = ["sequenceDiagram",
                                  "A->> B: Query",
                                  "B->> C: Forward query",
                                  "Note right of C: Thinking...",
                                  "C-> B: No Arrow",
                                  "B-->> A: Dashed Arrow"].join('\n');

    const seqDiagramInsertion = React.createElement('button', { 
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + seqDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.seqDiagramIcon);

    const generalDiagramSampleText = ["graph TD",
                                  "A-->B;",
                                  "A-->C;",
                                  "B-->|text|D;",
                                  "C-.->|dashed|D;"].join('\n');

    const veGraphInsertion = React.createElement('button', { 
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + generalDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.veGraphIcon);

    const makeHighlightBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "`" + currentValue.slice(stIndex, edIndex) + "`" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.highlightIcon);

    const makeBoldBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "**" + currentValue.slice(stIndex, edIndex) + "**" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.boldIcon);

    const makeItalicBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + " _" + currentValue.slice(stIndex, edIndex) + "_ " + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.italicIcon);

    const strikeOutBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "~~" + currentValue.slice(stIndex, edIndex) + "~~" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      },
    }, props.strikeOutIcon);

    const addFenceBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "\n```\n" + currentValue.slice(stIndex, edIndex) + "\n```\n" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.fenceIcon);

    const addLinkBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const stIndex = inputElement.selectionStart;
        const edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return; 
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, stIndex) + "[" + currentValue.slice(stIndex, edIndex) + "](http://your.link.here)" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.hyperlinkIcon);

    const listInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n- item 1\n- item 2\n- item 3\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.listIcon);

    const indentationSampleText = ["> level 1",
                                  ">> level 2", 
                                  "> > > level 3", 
                                  ].join('\n');
    const indentationInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: (evt) => {
        if (!widgetRef._inputRef) return;
        const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        const cursorIndex = inputElement.selectionStart;
        const currentValue = widgetRef._inputRef.value;
        const newValue = currentValue.slice(0, cursorIndex) + "\n" + indentationSampleText + "\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.indentationIcon);

    const alignCenterBtnStyle = {};
    Object.assign(alignCenterBtnStyle, sharedIconStyle);
    Object.assign(alignCenterBtnStyle, {
      display: ((!props.alignCenterTag || !props.alignCenterIcon) ? 'none' : 'inline-block'),
    });

		const alignCenterBtn = React.createElement('button', {
      style: alignCenterBtnStyle,
			onClick: (evt) => {
				if (!widgetRef._inputRef) return;
				const inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
				const stIndex = inputElement.selectionStart;
				const edIndex = inputElement.selectionEnd;
				if (edIndex <= stIndex) return; 
				const currentValue = widgetRef._inputRef.value;
				const newValue = currentValue.slice(0, stIndex) + "\n!{" + props.alignCenterTag + "}%\n" + currentValue.slice(stIndex, edIndex) + "\n%\n" + currentValue.slice(edIndex, currentValue.length);
				onContentChangedBridge(newValue);
			},
    }, props.alignCenterIcon);

    const shortcutBar = React.createElement('div', {
      key: 'shortcut-bar',
      style: {
        display: (shouldDisable() || shouldHideShortcutBar ? 'none' : 'block'),
        paddingBottom: 3,
      }
    }, videoPicker, imagePicker, makeHighlightBtn, addFenceBtn, makeBoldBtn, makeItalicBtn, strikeOutBtn, addLinkBtn, listInsertion, indentationInsertion, mathSampleInsertion, seqDiagramInsertion, veGraphInsertion, alignCenterBtn); 

    const input = React.createElement('textarea', {
      key: 'md-editor-input',
      style: {
        resize: 'none',
        display: (shouldDisable() ? 'none' : 'block'),
        width: '100%',
        height: 256,
        overflowY: 'auto',
        padding: 10,
      },
      ref: function(c) {
        if (!c) return;
        widgetRef._inputRef = c;
      },
      disabled: shouldDisable(),
      value: content,
      onChange: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
      onCut: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
      onPaste: (evt) => {
        onContentChangedBridge(evt.target.value);
      },
    });

    const refreshPreviewBtn = React.createElement('div', {
      style: {
        marginTop: 3,
        display: (widgetRef.state.cachedTextToRender == content || shouldDisable() ? 'none' : 'block'),
        textAlign: 'center',
        width: '100%',
      },
    }, React.createElement('button', {
        disabled: shouldDisable(),
        style: {
          fontSize: 14,
        },
        onClick: (evt) => {
          widgetRef.setState({
            cachedTextToRender: content,
          });
        },
      }, props.previewHint)
    );
    
    const shouldHidePreview = (!shouldDisable() && widgetRef.state.cachedTextToRender != content); 
    const previewSrc = (shouldDisable() ? content : widgetRef.state.cachedTextToRender);

    const preview = React.createElement(YAMDRenderer, {
      style: {
        marginTop: 3,
        width: '100%',
        display: (shouldHidePreview ? 'none' : 'block'),
        padding: 10,
      },
      imgTag: props.imgTag,
      ktxTag: props.ktxTag,
      mermaidTag: props.mermaidTag,
      alignCenterTag: props.alignCenterTag,
      previewableVideoList: previewableVideoList,
      previewableImageList: previewableImageList,
      source: previewSrc,
      ref: function(c) {
        if (!c) return;
        widgetRef._previewRef = c;
      }
    });

    const container = React.createElement('div', {
      style: props.style,
    }, shortcutBar, input, refreshPreviewBtn, preview);

    return container;
  },
});

YAMDEditor.propTypes = {
  style: React.PropTypes.object,
  previewableImagePickerTitle: React.PropTypes.any.isRequired,
  sharedIconStyle: React.PropTypes.object.isRequired,

  strikeOutIcon: React.PropTypes.any.isRequired,
  fenceIcon: React.PropTypes.any.isRequired,
  indentationIcon: React.PropTypes.any.isRequired,
  hyperlinkIcon: React.PropTypes.any.isRequired,
  listIcon: React.PropTypes.any.isRequired,

  veGraphIcon: React.PropTypes.any.isRequired,
  seqDiagramIcon: React.PropTypes.any.isRequired,
  mathIcon: React.PropTypes.any.isRequired,
  highlightIcon: React.PropTypes.any.isRequired, 
  boldIcon: React.PropTypes.any.isRequired,
  italicIcon: React.PropTypes.any.isRequired, 
  alignCenterIcon: React.PropTypes.any,

  previewHint: React.PropTypes.string.isRequired,

  content: React.PropTypes.string.isRequired,
  onContentChangedBridge: React.PropTypes.func.isRequired, 
  shouldDisable: React.PropTypes.func.isRequired,

  imgTag: React.PropTypes.string.isRequired,
  videoTag: React.PropTypes.string.isRequired,
  ktxTag: React.PropTypes.string.isRequired,
  mermaidTag: React.PropTypes.string.isRequired,
  alignCenterTag: React.PropTypes.string,

  previewableImageList: React.PropTypes.array,
  previewableVideoList: React.PropTypes.array,

  

  shouldHideShortcutBar: React.PropTypes.bool,
  hideVideoPickerWhenListEmpty: React.PropTypes.bool, 
  hideImagePickerWhenListEmpty: React.PropTypes.bool, 
}

exports.default = YAMDEditor;
