'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var SinglePicker = require('./SinglePicker').SinglePicker;
var SinglePickerItem = require('./SinglePicker').SinglePickerItem;
var YAMDRenderer = require('./YAMDRenderer').default;

var YAMDEditor = React.createClass({
  displayName: 'YAMDEditor',

  getInitialState: function getInitialState() {
    this._inputRef = null;
    this._previewRef = null;
    return {
      cachedTextToRender: ""
    };
  },
  insertVideoAtCursor: function insertVideoAtCursor(videoIdx) {
    var widgetRef = this;
    if (!widgetRef._inputRef) return;
    var props = widgetRef.props;

    var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    var cursorIndex = inputElement.selectionStart;
    var currentValue = widgetRef._inputRef.value;
    var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.videoTag + "}%" + videoIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  },
  insertImageAtCursor: function insertImageAtCursor(imageIdx) {
    var widgetRef = this;
    if (!widgetRef._inputRef) return;
    var props = widgetRef.props;

    var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
    var cursorIndex = inputElement.selectionStart;
    var currentValue = widgetRef._inputRef.value;
    var newValue = currentValue.slice(0, cursorIndex) + "\n!{" + props.imgTag + "}%" + imageIdx + "%\n" + currentValue.slice(cursorIndex, currentValue.length);
    props.onContentChangedBridge(newValue);
  },
  render: function render() {
    var widgetRef = this;
    var props = widgetRef.props;
    var content = props.content;
    var previewableVideoList = props.previewableVideoList;
    var previewableImageList = props.previewableImageList;

    var shouldDisable = props.shouldDisable;
    var sharedIconStyle = props.sharedIconStyle;

    var onContentChangedBridge = props.onContentChangedBridge;

    var shouldHideShortcutBar = undefined == props.shouldHideShortcutBar || null == props.shouldHideShortcutBar ? true : props.shouldHideShortcutBar;
    var hideVideoPickerWhenListEmpty = undefined == props.hideVideoPickerWhenListEmpty || null == props.hideVideoPickerWhenListEmpty ? true : props.hideVideoPickerWhenListEmpty;
    var hideImagePickerWhenListEmpty = undefined == props.hideImagePickerWhenListEmpty || null == props.hideImagePickerWhenListEmpty ? true : props.hideImagePickerWhenListEmpty;

    var videoItemList = [];
    if (undefined !== previewableVideoList && null !== previewableVideoList) {
      var _loop = function _loop(i) {
        var singleVideoItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: function onPress(evt) {
            widgetRef.insertVideoAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableVideoList[i].poster,
          style: {
            height: 64,
            objectFit: 'cover'
          }
        }));
        videoItemList.push(singleVideoItem);
      };

      for (var i = 0; i < previewableVideoList.length; ++i) {
        _loop(i);
      }
    }

    var videoPicker = React.createElement(SinglePicker, {
      id: 'video-picker',
      key: 'video-picker',
      title: props.previewableVideoPickerTitle,
      style: {
        display: hideVideoPickerWhenListEmpty && 0 == videoItemList.length ? 'none' : 'inline-block'
      }
    }, videoItemList);

    var imageItemList = [];
    if (undefined !== previewableImageList && null !== previewableImageList) {
      var _loop2 = function _loop2(i) {
        var singleImageItem = React.createElement(SinglePickerItem, {
          key: i,
          onPress: function onPress(evt) {
            widgetRef.insertImageAtCursor(i);
          }
        }, React.createElement('img', {
          src: previewableImageList[i].src,
          style: {
            height: 64,
            objectFit: 'cover'
          }
        }));
        imageItemList.push(singleImageItem);
      };

      for (var i = 0; i < previewableImageList.length; ++i) {
        _loop2(i);
      }
    }

    var imagePicker = React.createElement(SinglePicker, {
      id: 'image-picker',
      key: 'image-picker',
      title: props.previewableImagePickerTitle,
      style: {
        display: hideImagePickerWhenListEmpty && 0 == imageItemList.length ? 'none' : 'inline-block'
      }
    }, imageItemList);

    var mathSampleInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var cursorIndex = inputElement.selectionStart;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, cursorIndex) + "\n!{katex}% \\mathcal{L}(x) = \\sum\\_{lower}^{upper} \\oint\\_{\\partial \\Pi} \\sqrt{r\\_{\\mu}r^{\\nu} + b^2} \\cdot d\\vec{A} %\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.mathIcon);

    var seqDiagramSampleText = ["sequenceDiagram", "A->> B: Query", "B->> C: Forward query", "Note right of C: Thinking...", "C-> B: No Arrow", "B-->> A: Dashed Arrow"].join('\n');

    var seqDiagramInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var cursorIndex = inputElement.selectionStart;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + seqDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.seqDiagramIcon);

    var generalDiagramSampleText = ["graph TD", "A-->B;", "A-->C;", "B-->|text|D;", "C-.->|dashed|D;"].join('\n');

    var veGraphInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var cursorIndex = inputElement.selectionStart;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, cursorIndex) + "\n!{mermaid}%\n" + generalDiagramSampleText + "\n%\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.veGraphIcon);

    var makeHighlightBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "`" + currentValue.slice(stIndex, edIndex) + "`" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.highlightIcon);

    var makeBoldBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "**" + currentValue.slice(stIndex, edIndex) + "**" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.boldIcon);

    var makeItalicBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + " _" + currentValue.slice(stIndex, edIndex) + "_ " + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.italicIcon);

    var strikeOutBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "~~" + currentValue.slice(stIndex, edIndex) + "~~" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.strikeOutIcon);

    var addFenceBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "\n```\n" + currentValue.slice(stIndex, edIndex) + "\n```\n" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.fenceIcon);

    var addLinkBtn = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "[" + currentValue.slice(stIndex, edIndex) + "](http://your.link.here)" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.hyperlinkIcon);

    var listInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var cursorIndex = inputElement.selectionStart;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, cursorIndex) + "\n- item 1\n- item 2\n- item 3\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.listIcon);

    var indentationSampleText = ["> level 1", ">> level 2", "> > > level 3"].join('\n');
    var indentationInsertion = React.createElement('button', {
      style: sharedIconStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var cursorIndex = inputElement.selectionStart;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, cursorIndex) + "\n" + indentationSampleText + "\n" + currentValue.slice(cursorIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.indentationIcon);

    var alignCenterBtnStyle = {};
    Object.assign(alignCenterBtnStyle, sharedIconStyle);
    Object.assign(alignCenterBtnStyle, {
      display: !props.alignCenterTag || !props.alignCenterIcon ? 'none' : 'inline-block'
    });

    var alignCenterBtn = React.createElement('button', {
      style: alignCenterBtnStyle,
      onClick: function onClick(evt) {
        if (!widgetRef._inputRef) return;
        var inputElement = ReactDOM.findDOMNode(widgetRef._inputRef);
        var stIndex = inputElement.selectionStart;
        var edIndex = inputElement.selectionEnd;
        if (edIndex <= stIndex) return;
        var currentValue = widgetRef._inputRef.value;
        var newValue = currentValue.slice(0, stIndex) + "\n!{" + props.alignCenterTag + "}%\n" + currentValue.slice(stIndex, edIndex) + "\n%\n" + currentValue.slice(edIndex, currentValue.length);
        onContentChangedBridge(newValue);
      }
    }, props.alignCenterIcon);

    var shortcutBar = React.createElement('div', {
      key: 'shortcut-bar',
      style: {
        display: shouldDisable() || shouldHideShortcutBar ? 'none' : 'block',
        paddingBottom: 3
      }
    }, videoPicker, imagePicker, makeHighlightBtn, addFenceBtn, makeBoldBtn, makeItalicBtn, strikeOutBtn, addLinkBtn, listInsertion, indentationInsertion, mathSampleInsertion, seqDiagramInsertion, veGraphInsertion, alignCenterBtn);

    var input = React.createElement('textarea', {
      key: 'md-editor-input',
      style: {
        resize: 'none',
        display: shouldDisable() ? 'none' : 'block',
        width: '100%',
        height: 256,
        overflowY: 'auto',
        padding: 10
      },
      ref: function ref(c) {
        if (!c) return;
        widgetRef._inputRef = c;
      },
      disabled: shouldDisable(),
      value: content,
      onChange: function onChange(evt) {
        onContentChangedBridge(evt.target.value);
      },
      onCut: function onCut(evt) {
        onContentChangedBridge(evt.target.value);
      },
      onPaste: function onPaste(evt) {
        onContentChangedBridge(evt.target.value);
      }
    });

    var refreshPreviewBtn = React.createElement('div', {
      style: {
        marginTop: 3,
        display: widgetRef.state.cachedTextToRender == content || shouldDisable() ? 'none' : 'block',
        textAlign: 'center',
        width: '100%'
      }
    }, React.createElement('button', {
      disabled: shouldDisable(),
      style: {
        fontSize: 14
      },
      onClick: function onClick(evt) {
        widgetRef.setState({
          cachedTextToRender: content
        });
      }
    }, props.previewHint));

    var shouldHidePreview = !shouldDisable() && widgetRef.state.cachedTextToRender != content;
    var previewSrc = shouldDisable() ? content : widgetRef.state.cachedTextToRender;

    var preview = React.createElement(YAMDRenderer, {
      style: {
        marginTop: 3,
        width: '100%',
        display: shouldHidePreview ? 'none' : 'block',
        padding: 10
      },
      imgTag: props.imgTag,
      ktxTag: props.ktxTag,
      mermaidTag: props.mermaidTag,
      alignCenterTag: props.alignCenterTag,
      previewableVideoList: previewableVideoList,
      previewableImageList: previewableImageList,
      source: previewSrc,
      ref: function ref(c) {
        if (!c) return;
        widgetRef._previewRef = c;
      }
    });

    var container = React.createElement('div', {
      style: props.style
    }, shortcutBar, input, refreshPreviewBtn, preview);

    return container;
  }
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
  hideImagePickerWhenListEmpty: React.PropTypes.bool
};

exports.default = YAMDEditor;

