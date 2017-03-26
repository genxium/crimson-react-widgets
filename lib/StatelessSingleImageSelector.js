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

var StatelessSingleImageSelector = function (_React$Component) {
  _inherits(StatelessSingleImageSelector, _React$Component);

  function StatelessSingleImageSelector(props) {
    _classCallCheck(this, StatelessSingleImageSelector);

    var _this = _possibleConstructorReturn(this, (StatelessSingleImageSelector.__proto__ || Object.getPrototypeOf(StatelessSingleImageSelector)).call(this, props));

    _this._browseBtnRef = null;
    var widgetRef = _this;
    widgetRef._previewLoader = new FileReader();
    widgetRef._previewLoader.onload = function (evt) {
      widgetRef.props.onLocalImageAddedBridge(widgetRef.props.listIndex, {
        uploaderState: SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
        effectiveImgSrc: evt.target.result
      });
    };
    return _this;
  }

  _createClass(StatelessSingleImageSelector, [{
    key: '_softReset',
    value: function _softReset() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;

      if (null === bundle || undefined === bundle) return;

      if (SINGLE_UPLOADER_STATE.CREATED != bundle.uploaderState) {
        if (SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState && undefined !== bundle.extUploader && null !== bundle.extUploader) {
          bundle.extUploader.disableBrowse(props.shouldDisable());
        }
        if (undefined !== bundle.extUploader && null !== bundle.extUploader) {
          bundle.extUploader.refresh(); // NOTE: This is to update the `overlying browseButton` height according to the `seemingly browseButton` height. 
        }
        return;
      }

      var extUploader = widgetRef.createExtUploader();
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
      this._softReset();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this._softReset();
    }
  }, {
    key: 'getPreviewableImage',
    value: function getPreviewableImage() {
      return {
        src: this.props.bundle.effectiveImgSrc
      };
    }
  }, {
    key: 'createExtUploader',
    value: function createExtUploader() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundle = props.bundle;
      var shouldDisable = props.shouldDisable;
      var onLocalImageAddedBridge = props.onLocalImageAddedBridge;
      var onUploadedBridge = props.onUploadedBridge;
      var onProgressBridge = props.onProgressBridge;

      // Reference http://www.plupload.com/docs/v2/Uploader.
      var uploader = new PlupLoad.Uploader({
        browse_button: ReactDOM.findDOMNode(widgetRef._browseBtnRef),
        multi_selection: false
      });

      uploader.init();
      uploader.bind('FilesAdded', function (up, files) {
        var targetFile = files[0];
        var uploaderSelf = this;
        // NOTE: Remove previously added files in the uploader buffer.
        for (var k in uploaderSelf.files) {
          var single = uploaderSelf.files[k];
          if (single && single.id == targetFile.id) continue;
          uploaderSelf.removeFile(single);
        }

        if (!widgetRef.validateSelection(targetFile)) {
          props.showFileRequirementHint();
          onLocalImageAddedBridge(widgetRef.props.listIndex, {
            effectiveImgSrc: null
          });
          return;
        }

        uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid image is added for previewing.
        uploaderSelf.refresh();
        widgetRef._previewLoader.readAsDataURL(targetFile.getNative());
      });

      uploader.bind('UploadProgress', function (up, file) {
        onProgressBridge(widgetRef.props.listIndex, {
          uploaderState: SINGLE_UPLOADER_STATE.UPLOADING,
          progressPercentage: file.percent
        });
      });

      uploader.bind('FileUploaded', function (up, file, info) {
        onUploadedBridge(widgetRef.props.listIndex, true);
      });

      uploader.bind('Error', function (up, err) {
        onUploadedBridge(widgetRef.props.listIndex, false);
      });
      return uploader;
    }
  }, {
    key: 'startUpload',
    value: function startUpload() {
      var widgetRef = this;
      var props = widgetRef.props;
      var onUploadedBridge = props.onUploadedBridge;

      var bundle = props.bundle;
      if (SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) {
        onUploadedBridge(widgetRef.props.listIndex, true);
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
    key: 'validateSelection',
    value: function validateSelection(file) {
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
      var Image = props.Image;

      var onImageEditorTriggeredBridge = props.onImageEditorTriggeredBridge;
      var bundle = props.bundle;
      var sizePx = props.sizePx;
      var shouldDisable = props.shouldDisable;

      var progressBarSectionHeightPx = 32;
      var progressBarHeightPx = 10;
      var shouldHideProgressBar = SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState;
      var shouldHideImage = SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState;
      var shouldHideBrowseButton = SINGLE_UPLOADER_STATE.INITIALIZED != bundle.uploaderState || shouldDisable();

      var shouldDisableEditButton = !bundle.isOccupied() || shouldDisable();

      var progressBar = React.createElement(
        View,
        {
          key: 'single-image-selector-progress-bar-container',
          style: {
            position: "absolute",
            width: "100%",
            height: progressBarHeightPx,
            borderRadius: 3
          }
        },
        React.createElement(View, {
          key: 'single-image-selector-progress-bar',
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

      var imageAndProgressSection = React.createElement(
        View,
        {
          style: {
            position: "absolute",
            width: sizePx.w,
            height: sizePx.h
          }
        },
        React.createElement(Image, {
          key: 'single-image-selector-preview',
          style: {
            display: shouldHideImage ? "none" : "block",
            width: sizePx.w,
            height: shouldHideImage ? 0 : sizePx.h - progressBarSectionHeightPx,
            textAlign: "center",
            verticalAlign: "middle",
            objectFit: "contain"
          },
          src: bundle.effectiveImgSrc,
          onClick: function onClick(evt) {
            if (shouldDisableEditButton) return;
            onImageEditorTriggeredBridge(widgetRef.props.listIndex);
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
              textAlign: "center"
            } },
          progressBar
        )
      );

      var BrowserButtonComponent = props.BrowserButtonComponent;
      var browseButton = React.createElement(
        View,
        {
          style: {
            display: shouldHideBrowseButton ? "none" : "inline-block",
            width: sizePx.w,
            height: shouldHideBrowseButton ? 0 : sizePx.h
          }
        },
        React.createElement(BrowserButtonComponent, {
          key: 'single-image-selector-browse-btn',
          ref: function ref(c) {
            if (!c) return;
            widgetRef._browseBtnRef = c;
          }
        })
      );

      var containerStyle = {
        position: 'relative',
        width: sizePx.w,
        height: sizePx.h
      };

      return React.createElement(
        View,
        {
          key: 'single-image-selector-container',
          style: containerStyle
        },
        imageAndProgressSection,
        browseButton,
        uploadedMark
      );
    }
  }]);

  return StatelessSingleImageSelector;
}(React.Component);

StatelessSingleImageSelector.propTypes = {
  View: React.PropTypes.func.isRequired,
  Image: React.PropTypes.func.isRequired,

  sizePx: React.PropTypes.object.isRequired,
  bundle: React.PropTypes.any.isRequired,
  listIndex: React.PropTypes.number.isRequired, // NOTE: Access to `listIndex` is deliberately made DYNAMIC in this file!
  shouldDisable: React.PropTypes.func.isRequired,

  onImageEditorTriggeredBridge: React.PropTypes.func.isRequired,

  onNewBundleInitializedBridge: React.PropTypes.func.isRequired,

  onUploadedBridge: React.PropTypes.func.isRequired,
  onProgressBridge: React.PropTypes.func.isRequired,
  onLocalImageAddedBridge: React.PropTypes.func.isRequired,

  showFileRequirementHint: React.PropTypes.func.isRequired,
  singleFileSizeLimitBytes: React.PropTypes.number.isRequired,
  allowedMimeList: React.PropTypes.array.isRequired,

  uploadedMark: React.PropTypes.any.isRequired,
  progressBarColor: React.PropTypes.string.isRequired,

  BrowserButtonComponent: React.PropTypes.func.isRequired,

  queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired
};

exports.default = StatelessSingleImageSelector;

