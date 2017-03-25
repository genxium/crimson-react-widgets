'use-strict';

const React = require('react');
const ReactDOM = require('react-dom');

const SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;

const PlupLoad = require('plupload');

class StatelessSingleImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this._browseBtnRef = null;
    const widgetRef = this;
    widgetRef._previewLoader = new FileReader();
    widgetRef._previewLoader.onload = function (evt) {
      widgetRef.props.onLocalImageAddedBridge(widgetRef.props.listIndex, {
        uploaderState: SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING,
        effectiveImgSrc: evt.target.result,
      });
    };
  }

  _softReset() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundle = props.bundle;

    if (null === bundle || undefined === bundle) return;

    if (SINGLE_UPLOADER_STATE.CREATED != bundle.uploaderState) {
      if (SINGLE_UPLOADER_STATE.IDLE == bundle.uploaderState && undefined !== bundle.extUploader && null !== bundle.extUploader) {
        bundle.extUploader.disableBrowse(props.shouldDisable());
      }
      if (undefined !== bundle.extUploader && null !== bundle.extUploader) {
        bundle.extUploader.refresh(); // NOTE: This is to update the `overlying browseButton` height according to the `seemingly browseButton` height. 
      }
      return;
    }

    const extUploader = widgetRef.createExtUploader();
    props.onNewBundleCreatedBridge(widgetRef.props.listIndex, {
      uploaderState: SINGLE_UPLOADER_STATE.IDLE,
      progressPercentage: 0.0,
      effectiveImgSrc: null,
      extUploader: extUploader,
    });
  }

  componentDidMount() {
    this._softReset();
  }

  componentDidUpdate(prevProps, prevState) {

  }

  getPreviewableImage() {
    return {
      src: this.props.bundle.effectiveImgSrc,
    };
  }

  createExtUploader() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundle = props.bundle;
    const shouldDisable = props.shouldDisable;
    const onLocalImageAddedBridge = props.onLocalImageAddedBridge;
    const onUploadedBridge = props.onUploadedBridge;

    // Reference http://www.plupload.com/docs/v2/Uploader.
    const uploader = new PlupLoad.Uploader({
      browse_button: ReactDOM.findDOMNode(widgetRef._browseBtnRef),
      multi_selection: false,
    });

    uploader.init();
    uploader.bind('FilesAdded', function (up, files) {
      const targetFile = files[0];
      const uploaderSelf = this;
      // NOTE: Remove previously added files in the uploader buffer.
      for (let k in uploaderSelf.files) {
        const single = uploaderSelf.files[k];
        if (single && single.id == targetFile.id) continue;
        uploaderSelf.removeFile(single);
      }

      if (!widgetRef.validateSelection(targetFile)) {
        props.showFileRequirementHint();
        onLocalImageAddedBridge(widgetRef.props.listIndex, {
          effectiveImgSrc: null,
        });
        return;
      }

      uploaderSelf.disableBrowse(); // NOTE: Browsing is disabled once a valid image is added for previewing.
      uploaderSelf.refresh();
      widgetRef._previewLoader.readAsDataURL(targetFile.getNative());
    });

    uploader.bind('Error', function (up, err) {
      onUploadedBridge(widgetRef.props.listIndex, false);
    });
    return uploader;
  }

  startUpload() {
    const widgetRef = this;
    const props = widgetRef.props;
    const onUploadedBridge = props.onUploadedBridge;

    const bundle = props.bundle;
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
    props.queryAndSetSingleBundleExtUploaderCredentialsAsync(bundle.extUploader)
    .then(function(extUploader) {
      // Upon starting, the `PlupLoad.Uploader` instance will automatically collect header properties such as `Content-Length` as well as composite the `body` by the detected file and preset boundary.   
      extUploader.start();
    });

  }

  validateSelection(file) {
    const widgetRef = this;
    const props = widgetRef.props;

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

  render() {
    const widgetRef = this;
    const props = widgetRef.props;

    const View = props.View;
    const Image = props.Image;

    const onImageEditorTriggeredBridge = props.onImageEditorTriggeredBridge;
    const bundle = props.bundle;
    const sizePx = props.sizePx;
    const shouldDisable = props.shouldDisable;

    const progressBarSectionHeightPx = 32;
    const progressBarHeightPx = 10;
    const shouldHideProgressBar = (SINGLE_UPLOADER_STATE.UPLOADING != bundle.uploaderState);
    const shouldHideImage = (SINGLE_UPLOADER_STATE.IDLE == bundle.uploaderState);
    const shouldHideBrowseButton = (SINGLE_UPLOADER_STATE.IDLE != bundle.uploaderState || shouldDisable());

    const shouldDisableEditButton = (!bundle.isOccupied() || shouldDisable());

    const progressBar = (
      <View
        key='single-image-selector-progress-bar-container'
        style={{
          position: "absolute",
          width: "100%",
          height: progressBarHeightPx,
          borderRadius: 3,
        }}
      >
        <View
          key='single-image-selector-progress-bar'
          style={{
            display: (shouldHideProgressBar ? "none" : "block"),
            width: bundle.progressPercentage + "%",
            height: "100%",
            borderRadius: 3,
            backgroundColor: props.progressBarColor,
          }} />
      </View>
    );

    const uploadedMarkSizePx = {
      w: (sizePx.w >> 3),
      h: (sizePx.h >> 3),
    };
    const uploadedMarkOffsetPx = {
      top: 0,
      left: (sizePx.w - uploadedMarkSizePx.w),
    };
    const uploadedMark = (
      <View
        style={{
          display: ((!shouldDisable() && SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) ? 'inherit' : 'none'),
          fontSize: 16,
          position: "absolute",
          top: uploadedMarkOffsetPx.top,
          left: uploadedMarkOffsetPx.left,
          width: uploadedMarkSizePx.w,
          height: uploadedMarkSizePx.h,
        }}
      >
        {props.uploadedMark}
      </View>
    );

    const imageAndProgressSection = (
      <View
        style={{
          position: "absolute",
          width: sizePx.w,
          height: sizePx.h,
        }}
      >
        <Image
          key='single-image-selector-preview'
          style={{
            display: (shouldHideImage ? "none" : "block"),
            width: sizePx.w,
            height: (shouldHideImage ? 0 : (sizePx.h - progressBarSectionHeightPx)),
            textAlign: "center",
            verticalAlign: "middle",
            objectFit: "contain",
          }}
          src={bundle.effectiveImgSrc}
          onClick={(evt) => {
            if (shouldDisableEditButton) return;
            onImageEditorTriggeredBridge(widgetRef.props.listIndex);
          }}
        />
        <View
          style={{
            display: (!shouldHideBrowseButton ? "none" : "block"),
            position: "relative",
            width: sizePx.w,
            height: progressBarSectionHeightPx,
            textAlign: "center"
          }}>
          {progressBar}
        </View>
      </View>
    );

    const BrowserButtonComponent = props.BrowserButtonComponent;
    const browseButton = (
      <View
      style={{
        display: (shouldHideBrowseButton ? "none" : "inline-block"),
        width: sizePx.w,
        height: (shouldHideBrowseButton ? 0 : sizePx.h),
      }}
      >
        <BrowserButtonComponent
          key='single-image-selector-browse-btn'
          ref={function (c) {
            if (!c) return;
            widgetRef._browseBtnRef = c;
          }}
        />
      </View>
    );

    const containerStyle = {
      position: 'relative',
      width: sizePx.w,
      height: sizePx.h,
    };

    return (
      <View
        key='single-image-selector-container'
        style={containerStyle}
      >
        {imageAndProgressSection}
        {browseButton}
        {uploadedMark}
      </View>
    );
  }
}

StatelessSingleImageSelector.propTypes = {
  View: React.PropTypes.func.isRequired, 
  Image: React.PropTypes.func.isRequired, 

  sizePx: React.PropTypes.object.isRequired,
  bundle: React.PropTypes.any.isRequired,
  listIndex: React.PropTypes.number.isRequired, // NOTE: Access to `listIndex` is deliberately made DYNAMIC in this file!
  shouldDisable: React.PropTypes.func.isRequired,

  onImageEditorTriggeredBridge: React.PropTypes.func.isRequired,

  onNewBundleCreatedBridge: React.PropTypes.func.isRequired,

  onUploadedBridge: React.PropTypes.func.isRequired,
  onProgressBridge: React.PropTypes.func.isRequired,
  onLocalImageAddedBridge: React.PropTypes.func.isRequired,

  showFileRequirementHint: React.PropTypes.func.isRequired,
  singleFileSizeLimitBytes: React.PropTypes.number.isRequired,
  allowedMimeList: React.PropTypes.array.isRequired,

  uploadedMark: React.PropTypes.any.isRequired,
  progressBarColor: React.PropTypes.string.isRequired,

  BrowserButtonComponent: React.PropTypes.func.isRequired,

  queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired,
};

exports.default = StatelessSingleImageSelector;
