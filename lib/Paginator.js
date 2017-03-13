'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sharedLib = require('./shared');
var React = require('react');

var Paginator = function (_React$Component) {
	_inherits(Paginator, _React$Component);

	_createClass(Paginator, [{
		key: 'requestDataAsync',
		value: function requestDataAsync(requestedPage) {
			var widgetRef = this;
			var props = widgetRef.props;
			var dataUrl = props.dataUrl;
			var collectFilters = props.collectFilters;
			var paramDict = {
				page: requestedPage
			};

			Object.assign(paramDict, collectFilters());
			return sharedLib.httpGet(dataUrl, paramDict).then(function (response) {
				return response.json();
			}).then(function (responseData) {
				return new Promise(function (resolve, reject) {
					resolve(responseData);
				});
			});
		}
	}, {
		key: '_createNoResultHeader',
		value: function _createNoResultHeader(idx) {
			var widgetRef = this;
			var props = widgetRef.props;
			var View = props.View;
			var Image = props.Image;
			var noResultHint = React.createElement(View, {
				key: 'paginator-no-result-hint'
			}, '' + props.noResultHint);
			var noResultHintIcon = React.createElement(props.noResultHintIcon, {
				key: 'paginator-no-result-hint-icon'
			}, null);

			return React.createElement(View, {
				idx: idx,
				key: idx,
				ref: function ref(c) {
					if (!c) return;
					var newHeight = sharedLib.getRenderedComponentSize(c).height;
					var theIdx = c.props.idx;
					var headerHeightDict = {};
					for (var k in widgetRef.state.headerHeightDict) {
						headerHeightDict[k] = widgetRef.state.headerHeightDict[k];
					}
					var oldHeight = !headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx];
					if (oldHeight == newHeight) return;

					headerHeightDict[theIdx] = newHeight;
					widgetRef.setState({
						headerHeightDict: headerHeightDict
					});
				},
				style: {
					textAlign: 'center'
				}
			}, [noResultHint, noResultHintIcon]);
		}
	}]);

	function Paginator(props) {
		_classCallCheck(this, Paginator);

		var _this = _possibleConstructorReturn(this, (Paginator.__proto__ || Object.getPrototypeOf(Paginator)).call(this, props));

		_this._footerHeightPx = 32;
		_this.styles = {
			footer: {
				position: 'relative',
				left: 0,
				right: 0,
				height: _this._footerHeightPx
			},
			footerBtn: {
				position: 'absolute',
				width: '40%',
				border: 'none',
				outline: 'none',
				boxShadow: 'none',
				padding: '0',
				verticalAlign: 'middle',
				height: _this._footerHeightPx
			},
			activePage: {
				position: 'absolute',
				width: '20%',
				lineHeight: _this._footerHeightPx.toString() + 'px',
				height: _this._footerHeightPx,
				fontSize: 20,
				textAlign: 'center',
				verticalAlign: 'middle',
				left: '40%'
			}
		};

		_this._listviewRef = null;
		_this._footerRef = null;

		_this.state = {
			headerHeightDict: {},
			cellHeightDict: {}
		};
		return _this;
	}

	_createClass(Paginator, [{
		key: '_wrapSingleCell',
		value: function _wrapSingleCell(idx, singleCell) {
			var widgetRef = this;
			var props = widgetRef.props;
			var View = props.View;

			var wrappedCell = React.createElement(View, {
				idx: idx,
				key: idx,
				ref: function ref(c) {
					if (!c) return;
					var newHeight = sharedLib.getRenderedComponentSize(c).height;
					var theIdx = c.props.idx;
					var cellHeightDict = {};
					for (var k in widgetRef.state.cellHeightDict) {
						cellHeightDict[k] = widgetRef.state.cellHeightDict[k];
					}
					var oldHeight = !cellHeightDict.hasOwnProperty(theIdx) ? null : cellHeightDict[theIdx];

					if (oldHeight == newHeight) return;
					cellHeightDict[theIdx] = newHeight;
					widgetRef.setState({
						cellHeightDict: cellHeightDict
					});
				}
			}, singleCell);

			return wrappedCell;
		}
	}, {
		key: '_wrapSingleHeader',
		value: function _wrapSingleHeader(idx, singleHeader) {
			var widgetRef = this;
			var props = widgetRef.props;
			var View = props.View;
			var wrappedHeader = React.createElement(View, {
				idx: idx,
				key: idx,
				ref: function ref(c) {
					if (!c) return;
					var newHeight = sharedLib.getRenderedComponentSize(c).height;
					var theIdx = c.props.idx;
					var headerHeightDict = {};
					for (var k in widgetRef.state.headerHeightDict) {
						headerHeightDict[k] = widgetRef.state.headerHeightDict[k];
					}
					var oldHeight = !headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx];

					if (oldHeight == newHeight) return;
					headerHeightDict[theIdx] = newHeight;
					widgetRef.setState({
						headerHeightDict: headerHeightDict
					});
				}
			}, singleHeader);
			return wrappedHeader;
		}
	}, {
		key: 'render',
		value: function render() {
			var widgetRef = this;
			var props = widgetRef.props;
			var View = props.View;
			var Text = props.Text;
			var Image = props.Image;
			var Button = props.Button;
			var totSizePx = props.totSizePx;
			var activePage = props.activePage;
			var onPageSelectedBridge = props.onPageSelectedBridge;
			var cellHeight = props.cellHeight;
			var cellList = props.cellList;
			var presetHeaderList = props.presetHeaderList;
			var nPerPage = props.nPerPage;
			var BackArrow = props.BackArrow;

			var styles = widgetRef.styles;
			var page = activePage();

			var shouldDisplayBackwardBtn = 1 < page;
			var effectivePresetHeaderCount = undefined === presetHeaderList || null === presetHeaderList ? 0 : presetHeaderList.length;
			var netCellCount = cellList.length;
			var shouldDisplayNoResultHeader = 0 >= netCellCount;
			var dynamicNperpage = undefined === nPerPage ? 10 /* temporarily hardcoded magic number */ : nPerPage;
			var shouldDisplayForwardBtn = !shouldDisplayNoResultHeader && dynamicNperpage <= netCellCount;

			var wrappedHeaderList = [];
			if (undefined !== presetHeaderList && null !== presetHeaderList) {
				for (var i = 0; i < presetHeaderList.length; ++i) {
					var wrappedHeader = widgetRef._wrapSingleHeader(i, presetHeaderList[i]);
					wrappedHeaderList.push(wrappedHeader);
				}
			}

			var noResultHeaderIdx = effectivePresetHeaderCount;
			var noResultHeader = shouldDisplayNoResultHeader ? widgetRef._createNoResultHeader(noResultHeaderIdx) : null;

			if (null !== noResultHeader) {
				wrappedHeaderList.push(noResultHeader);
			}

			var wrappedCellList = [];
			for (var _i = 0; _i < cellList.length; ++_i) {
				var wrappedCell = widgetRef._wrapSingleCell(_i + wrappedHeaderList.length, cellList[_i]);
				wrappedCellList.push(wrappedCell);
			}

			var allCellList = [];
			for (var _i2 = 0; _i2 < wrappedHeaderList.length; ++_i2) {
				allCellList.push(wrappedHeaderList[_i2]);
			}
			for (var _i3 = 0; _i3 < wrappedCellList.length; ++_i3) {
				allCellList.push(wrappedCellList[_i3]);
			}

			var allCellHeightList = [];
			for (var _i4 = 0; _i4 < wrappedHeaderList.length; ++_i4) {
				var theIdx = _i4;
				if (widgetRef.state.headerHeightDict.hasOwnProperty(theIdx)) {
					allCellHeightList.push(widgetRef.state.headerHeightDict[theIdx]);
				} else {
					allCellHeightList.push(cellHeight);
				}
			}

			for (var _i5 = 0; _i5 < wrappedCellList.length; ++_i5) {
				var _theIdx = _i5 + wrappedHeaderList.length;
				if (widgetRef.state.cellHeightDict.hasOwnProperty(_theIdx)) {
					allCellHeightList.push(widgetRef.state.cellHeightDict[_theIdx]);
				} else {
					allCellHeightList.push(cellHeight);
				}
			}

			var backArrowElement = React.createElement(BackArrow, null, null);

			var backwardBtn = React.createElement(Button, {
				key: 'paginator-backward-btn',
				onPress: function onPress(evt) {
					var selectedPage = page - 1;
					onPageSelectedBridge(selectedPage);
				},
				style: Object.assign({
					background: 'transparent',
					display: shouldDisplayBackwardBtn ? 'inline' : 'none',
					left: '0',
					transform: 'scaleX(-1)'
				}, styles.footerBtn)
			}, backArrowElement);

			var forwardBtn = React.createElement(Button, {
				key: 'paginator-forward-btn',
				onPress: function onPress(evt) {
					var selectedPage = page + 1;
					onPageSelectedBridge(selectedPage);
				},
				style: Object.assign({
					background: 'transparent',
					display: shouldDisplayForwardBtn ? 'inline' : 'none',
					left: '60%'
				}, styles.footerBtn)
			}, backArrowElement);

			var footer = null;
			var onFooterMounted = function onFooterMounted(c) {
				if (!c) return;
				if (null !== widgetRef._footerRef) return;
				widgetRef._footerRef = c;
			};

			var listView = null;
			var wrapperHeight = totSizePx.height - widgetRef._footerHeightPx;

			var listViewProps = Object.assign({
				key: 'paginator-listview',
				style: {
					height: wrapperHeight,
					overflowY: 'scroll',
					WebkitOverflowScrolling: 'touch'
				},
				ref: function ref(c) {
					if (null === c) return;
					if (null !== widgetRef._listviewRef) return;
					widgetRef._listviewRef = c;
				}
			});

			listView = React.createElement(View, listViewProps, allCellList);

			var footerStyle = {};
			Object.assign(footerStyle, styles.footer);

			var pageIndicator = React.createElement(View, {
				key: 'paginator-page-indicator',
				style: styles.activePage
			}, '' + page);

			footer = React.createElement(View, {
				key: 'paginator-footer',
				ref: onFooterMounted,
				style: footerStyle
			}, [backwardBtn, pageIndicator, forwardBtn]);

			var overallStyle = {};

			Object.assign(overallStyle, widgetRef.props.style);

			return React.createElement(View, {
				style: overallStyle
			}, [listView, footer]);
		}
	}]);

	return Paginator;
}(React.Component);

exports.default = Paginator;

