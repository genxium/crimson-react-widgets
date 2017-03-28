'use strict';
'use-strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;

var PlupLoad = require('plupload');

var LIST_INDEX = 'listIndex';

var StatelessSingleVideoSelector = function (_React$Component) {
  _inherits(StatelessSingleVideoSelector, _React$Component);

  function StatelessSingleVideoSelector(props) {
    _classCallCheck(this, StatelessSingleVideoSelector);

    var _this = _possibleConstructorReturn(this, (StatelessSingleVideoSelector.__proto__ || Object.getPrototypeOf(StatelessSingleVideoSelector)).call(this, props));

    _this._browseBtnRef = null;
    return _this;
  }

  _createClass(StatelessSingleVideoSelector, [{
    key: '_updatePluploadExtUploaderListIndex',
    value: function _updatePluploadExtUploaderListIndex() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      if (!bundle) return;
      var extUploader = bundle.extUploader;
      if (!extUploader) return;
      extUploader.setOption({
        listIndex: widgetRef.props.listIndex
      });
    }
  }, {
    key: '_initializePluploadExtUploaderEvtBinding',
    value: function _initializePluploadExtUploaderEvtBinding(extUploader) {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      var shouldDisable = props.shouldDisable;
      var onLocalVideoAddedBridge = props.onLocalVideoAddedBridge;
      var onUploadedBridge = props.onUploadedBridge;
      var onProgressBridge = props.onProgressBridge;

      extUploader.bind('FilesAdded', function (up, files) {
        var targetFile = files[0];
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        // NOTE: Remove previously added files in the uploader buffer.
        for (var k in uploaderSelf.files) {
          var single = uploaderSelf.files[k];
          if (single && single.id == targetFile.id) continue;
          uploaderSelf.removeFile(single);
        }

        if (!widgetRef._validateSelection(targetFile)) {
          props.showFileRequirementHint();
          onLocalVideoAddedBridge(listIndex, {
            effectiveImgSrc: null
          });
          return;
        }

        uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid video is added for previewing.
        uploaderSelf.refresh();
        widgetRef.props.onLocalVideoAddedBridge(uploaderSelf.getOption(LIST_INDEX), {
          uploaderState: SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
          effectiveImgSrc: (window.URL ? URL : webkitURL).createObjectURL(targetFile.getNative())
        });
      });

      extUploader.bind('UploadProgress', function (up, file) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onProgressBridge(listIndex, {
          uploaderState: SINGLE_UPLOADER_STATE.UPLOADING,
          progressPercentage: file.percent
        });
      });

      extUploader.bind('FileUploaded', function (up, file, info) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onUploadedBridge(listIndex, true);
      });

      extUploader.bind('Error', function (up, err) {
        var uploaderSelf = this;
        var listIndex = parseInt(uploaderSelf.getOption(LIST_INDEX));
        onUploadedBridge(listIndex, false);
      });
    }
  }, {
    key: '_softReset',
    value: function _softReset() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;

      if (null === bundle || undefined === bundle) return;
      if (SINGLE_UPLOADER_STATE.CREATED != bundle.uploaderState) {
        if (undefined === bundle.extUploader || null === bundle.extUploader) return;
        widgetRef._updatePluploadExtUploaderListIndex();
        bundle.extUploader.refresh(); // NOTE: This is to update the `overlying browseButton` height according to the `seemingly browseButton` height. 
        bundle.extUploader.disableBrowse(props.shouldDisable());
        return;
      }

      var extUploader = widgetRef.createExtUploader();
      widgetRef._initializePluploadExtUploaderEvtBinding(extUploader);
      props.onNewBundleInitializedBridge(widgetRef.props.listIndex, {
        uploaderState: SINGLE_UPLOADER_STATE.INITIALIZED,
        progressPercentage: 0.0,
        effectiveImgSrc: null,
        extUploader: extUploader
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var widgetRef = this;
      widgetRef._softReset();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var widgetRef = this;
      widgetRef._softReset();
    }
  }, {
    key: 'createExtUploader',
    value: function createExtUploader() {
      var widgetRef = this;
      var props = widgetRef.props;
      var chunkSize = props.chunkSize;

      // Reference http://www.plupload.com/docs/v2/Uploader.
      var uploader = new PlupLoad.Uploader({
        browse_button: ReactDOM.findDOMNode(widgetRef._browseBtnRef),
        multi_selection: false,
        chunk_size: chunkSize
      });

      uploader.init();
      return uploader;
    }
  }, {
    key: 'startUpload',
    value: function startUpload() {
      var widgetRef = this;
      var props = widgetRef.props;
      var listIndex = props.listIndex;
      var onUploadedBridge = props.onUploadedBridge;

      var bundle = props.bundle;
      if (SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) {
        onUploadedBridge(listIndex, true);
        return;
      }
      if (SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING != bundle.uploaderState) {
        // NOTE: Invalid block here, the player should NEVER trigger this block.
        return;
      }

      /*
        // Besides, typical credentials, e.g. `upload token` or simply `uptoken`, are set into the http request headers or multipart body. In the case of plupload with Chinenet as CDN provider, one might have to set the followings. 
         url: <host endpoint>,
        multipart_params: {
          // Add extra multipart {name => value} form-data
          token: <the upload token> 
        }
      */
      props.queryAndSetSingleBundleExtUploaderCredentialsAsync(bundle.extUploader).then(function (extUploader) {
        // Upon starting, the `PlupLoad.Uploader` instance will automatically collect header properties such as `Content-Length` as well as composite the `body` by the detected file and preset boundary.   
        extUploader.start();
      });
    }
  }, {
    key: '_validateSelection',
    value: function _validateSelection(file) {
      var widgetRef = this;
      var props = widgetRef.props;

      if (null === file || undefined === file) {
        return false;
      }
      if (file.size > props.singleFileSizeLimitBytes) {
        return false;
      }

      if (-1 == props.allowedMimeList.indexOf(file.type)) {
        return false;
      }

      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;

      var View = props.View;
      var Video = props.Video;

      var onVideoEditorTriggeredBridge = props.onVideoEditorTriggeredBridge;
      var bundle = props.bundle;
      var sizePx = props.sizePx;
      var shouldDisable = props.shouldDisable;

      var progressBarSectionHeightPx = 32;
      var progressBarHeightPx = 10;
      var shouldHideProgressBar = SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState;
      var shouldHideVideo = SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState;
      var shouldHideBrowseButton = SINGLE_UPLOADER_STATE.INITIALIZED != bundle.uploaderState || shouldDisable();

      var shouldDisableEditButton = !bundle.isOccupied() || shouldDisable();

      var progressBar = React.createElement(
        View,
        {
          key: 'single-video-selector-progress-bar-container',
          style: {
            position: "absolute",
            width: "100%",
            height: progressBarHeightPx,
            borderRadius: 3
          }
        },
        React.createElement(View, {
          key: 'single-video-selector-progress-bar',
          style: {
            display: shouldHideProgressBar ? "none" : "block",
            width: bundle.progressPercentage + "%",
            height: "100%",
            borderRadius: 3,
            backgroundColor: props.progressBarColor
          } })
      );

      var uploadedMarkSizePx = {
        w: sizePx.w >> 3,
        h: sizePx.h >> 3
      };
      var uploadedMarkOffsetPx = {
        top: 0,
        left: sizePx.w - uploadedMarkSizePx.w
      };
      var uploadedMark = React.createElement(
        View,
        {
          style: {
            display: SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState ? 'inherit' : 'none',
            fontSize: 16,
            position: "absolute",
            top: uploadedMarkOffsetPx.top,
            left: uploadedMarkOffsetPx.left,
            width: uploadedMarkSizePx.w,
            height: uploadedMarkSizePx.h
          }
        },
        props.uploadedMark
      );

      var videoAndProgressSection = React.createElement(
        View,
        {
          style: {
            position: "absolute",
            width: sizePx.w,
            height: sizePx.h
          }
        },
        React.createElement('video', {
          controls: true,
          key: 'single-video-selector-preview',
          src: bundle.effectiveImgSrc,
          style: {
            display: shouldHideVideo ? "none" : "block",
            width: sizePx.w,
            height: shouldHideVideo ? 0 : sizePx.h - progressBarSectionHeightPx,
            objectFit: "contain"
          },
          onClick: function onClick(evt) {
            if (shouldDisableEditButton) return;
            onVideoEditorTriggeredBridge(widgetRef.props.listIndex);
          }
        }),
        React.createElement(
          View,
          {
            style: {
              display: !shouldHideBrowseButton ? "none" : "block",
              position: "relative",
              width: sizePx.w,
              height: progressBarSectionHeightPx,
              textAlign: "center",
              verticalAlign: "middle"
            } },
          progressBar
        )
      );

      var BrowserButtonComponent = props.BrowserButtonComponent;
      var browseButton = React.createElement(
        View,
        {
          key: 'single-video-selector-browse-btn',
          style: {
            position: "absolute",
            display: shouldHideBrowseButton ? "none" : "inline-block",
            width: sizePx.w,
            height: shouldHideBrowseButton ? 0 : sizePx.h,
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: parseInt(sizePx.h) + 'px'
          },
          ref: function ref(c) {
            if (!c) return;
            widgetRef._browseBtnRef = c;
          }
        },
        React.createElement(BrowserButtonComponent, null)
      );

      var containerStyle = {
        position: 'relative',
        width: sizePx.w,
        height: sizePx.h
      };

      return React.createElement(
        View,
        {
          key: 'single-video-selector-container',
          style: containerStyle
        },
        videoAndProgressSection,
        browseButton,
        uploadedMark
      );
    }
  }]);

  return StatelessSingleVideoSelector;
}(React.Component);

StatelessSingleVideoSelector.propTypes = {
  chunkSize: React.PropTypes.string,

  View: React.PropTypes.func.isRequired,

  sizePx: React.PropTypes.object.isRequired,
  bundle: React.PropTypes.any.isRequired,
  listIndex: React.PropTypes.number.isRequired,
  shouldDisable: React.PropTypes.func.isRequired,

  onVideoEditorTriggeredBridge: React.PropTypes.func.isRequired,

  onNewBundleInitializedBridge: React.PropTypes.func.isRequired,

  onUploadedBridge: React.PropTypes.func.isRequired,
  onProgressBridge: React.PropTypes.func.isRequired,
  onLocalVideoAddedBridge: React.PropTypes.func.isRequired,

  showFileRequirementHint: React.PropTypes.func.isRequired,
  singleFileSizeLimitBytes: React.PropTypes.number.isRequired,
  allowedMimeList: React.PropTypes.array.isRequired,

  uploadedMark: React.PropTypes.any.isRequired,
  progressBarColor: React.PropTypes.string.isRequired,

  BrowserButtonComponent: React.PropTypes.func.isRequired,

  queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired
};

exports.default = StatelessSingleVideoSelector;

