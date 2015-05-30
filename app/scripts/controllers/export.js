angular.module('adminApp')
  .controller('ExportCtrl', function ($scope) {
    $scope.tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
        , format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
          })
        }
      return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;
        document.getElementById("dlink").click();

      }
    })()
  });


function init() {
  var a = {
    actions: [{key: "goog", pretty: chrome.i18n.getMessage("googleDocAction")}, {
      key: "copy",
      pretty: chrome.i18n.getMessage("copyClipboardAction")
    }], sorts: [], page: {size: 5}, displayInline: !1
  };
  tableShow = new TableShow($(document.body), a)
}
function destroy() {
  $chk(tableShow) && (tableShow.destroy(), tableShow = null)
}
window.addEvent("domready", init);
var gDocs = {
  base: "",
  api: "",
  url: {ss: {"new": "http://spreadsheets.google.com/ccc?new=true", test: "http://localhost/g/dev/sig/table2doc/test/"}}
}, DisplayUtil = {
  setNewlyCreatedTab: function (a) {
    Cookie.set("tableCaptureTab", a, {duration: 183, path: chrome.extension.getURL("/")})
  }
}, TableShow = new Class({
  cbs: null, data: null, settings: null, state: null, dom: null, initialize: function (a, b) {
    this.settings = b;
    this.state = {page: 0};
    this.dom = {wrapper: a};
    this.initCallbacks();
    this.refresh()
  }, initCallbacks: function () {
    this.cbs = {
      highlight: this.highlightTable,
      unhighlight: this.unhighlightTable, copy: this.copyTable, goog: this.googTable
    }
  }, getTableDefs: function () {
    return chrome.extension.getBackgroundPage().tableDefs
  }, display: function () {
    this.dom.wrapper.empty();
    var a = this.getTableDefs();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a).adopt(this.getAd())
  }, getAd: function () {
    var a = new Element("fieldset", {"class": "_tc_footer_ad"}), b = (new Element("legend", {})).setHTML("Shameless self-promotion"),
      c = (new Element("a", {
        href: "http://presentio.us/", events: {
          click: function () {
            chrome.tabs.create({url: "http://presentio.us/"});
            return !1
          }
        }
      })).setHTML("Try Presentious"), d = (new Element("span", {})).setHTML(": The easiest and most effective way to share live presentations!");
    a.adopt(b).adopt(c).adopt(d);
    return a
  }, displayHeader: function (a) {
    var b = new Element("div", {"class": "_tc_header"});
    b.adopt(this.displayHeaderActionWrap()).adopt(this.displayHeaderTitle(a));
    return b
  }, displayHeaderTitle: function (a) {
    return (new Element("div",
      {"class": "_tc_title"})).setHTML(chrome.i18n.getMessage("tablesFoundTitle", [a]))
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
        title: chrome.i18n.getMessage("refreshDescription"),
        "class": "header_action",
        id: "refresh_action",
        events: {click: this.refresh.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
        title: chrome.i18n.getMessage("detachPaneDescription"),
        "class": "header_action",
        id: "inpage_action",
        events: {click: this.inPageDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("detachPaneAction")),
      d = (new Element("a", {
        title: chrome.i18n.getMessage("inlineDescription"),
        "class": "header_action",
        id: "inline_action",
        events: {click: this.inLineDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("inlineAction"));
    a.adopt(d).adopt(c).adopt(b);
    return a
  }, displayTableList: function (a) {
    var b = new Element("ol", {"class": "_tc_table_list"});
    a.each(function (a) {
      try {
        var d = new Element("li", {
          id: a.table.id, "class": "table_def_el", events: {
            mouseenter: this.callbackCheck.bindWithEvent(this, [a, "highlight"]),
            mouseleave: this.callbackCheck.bindWithEvent(this,
              [a, "unhighlight"])
          }
        });
        d.adopt((new Element("span", {title: a.table.id, "class": "non_action"})).setHTML(a.table.adjusted));
        $each(this.settings.actions, function (b) {
          d.adopt((new Element("a", {
            "class": "action action_" + b.key,
            events: {click: this.callbackCheck.bindWithEvent(this, [a, b.key])}
          })).setHTML(b.pretty))
        }, this);
        b.adopt(d)
      } catch (e) {
      }
    }, this);
    return b
  }, displayLoader: function () {
    this.dom.wrapper.adopt(new Element("img", {src: chrome.extension.getURL("/") + "images/loader.gif"}))
  }, callbackCheck: function (a, b, c) {
    try {
      this.cbs[c].bind(this)(b)
    } catch (d) {
    }
  },
  refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    var a = chrome.extension.getBackgroundPage(), b = a.selectedId;
    chrome.tabs.sendRequest(b, {action: "refresh"}, function (c) {
      a.updateWithTables(b, c);
      setTimeout(this.display.bind(this), 250)
    }.bind(this))
  }, clear: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "clear"}, function (a) {
    })
  }, destroy: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "destroy"},
      function (a) {
      })
  }, copyTable: function (a, b) {
    var c = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(c, {action: "copy", id: a.table.id, index: a.index}, function (a) {
      $chk(b) && (b = b.bind(this), b())
    })
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    console.log("TableShow::googDocCreate");
    chrome.tabs.create({selected: !0, url: gDocs.url.ss["new"]}, function (a) {
      DisplayUtil.setNewlyCreatedTab(a.id)
    })
  }, highlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "highlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, unhighlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "unhighlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, inPageDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inpage"}, function (a) {
      window.close()
    })
  }, inLineDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a,
      {action: "inline"}, function (a) {
        window.close()
      })
  }
}), DetachedTableShow = TableShow.extend({
  initialize: function (a, b) {
    var c = new Element("div", {"class": "_tc_detachedWrapper", id: "tableWrapper_detached"});
    b.displayInline || a.adopt(c);
    this.parent(c, b)
  }, getTableDefs: function () {
    var a = [];
    try {
      a = tableMan.getTableDefs()
    } catch (b) {
    }
    return a
  }, display: function () {
    var a = this.getTableDefs();
    this.settings.displayInline ? (this.dom.wrapper.addClass("_tc_offscreeneded"), this.displayInlineMenu(a)) : this.displayDetachedMenu(a)
  },
  displayInlineMenu: function (a) {
    a.each(function (a) {
      var c = tableMan.getTable(a.index, a.id);
      a = {
        actions: [{
          className: "action_copy",
          text: chrome.i18n.getMessage("copyClipboardAction"),
          cb: function (a, b) {
            this.copyTable(b)
          }.bindWithEvent(this, [a])
        }, {
          className: "action_goog", text: chrome.i18n.getMessage("googleDocAction"), cb: function (a, b) {
            this.googTable(b)
          }.bindWithEvent(this, [a])
        }]
      };
      c.applyInlineMenu(a)
    }, this)
  }, displayDetachedMenu: function (a) {
    this.dom.wrapper.empty();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a);
    new Drag.Move(this.dom.wrapper, {handle: this.dom.header})
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"),
      "class": "header_action",
      id: "refresh_action",
      events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("removeDetachedDescription"),
      "class": "header_action", id: "remove_action", events: {
        click: function (a) {
          this.removeFromPage();
          this.destroy()
        }.bindWithEvent(this)
      }
    })).setHTML(chrome.i18n.getMessage("removeAction"));
    a.adopt(c).adopt(b);
    return a
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    tableMan.destroy();
    tableMan.findTables();
    setTimeout(this.display.bind(this), 500)
  }, clear: function () {
    tableMan.clear()
  }, destroy: function () {
    tableMan && (tableMan.destroy(), tableMan = null)
  }, copyTable: function (a, b) {
    console.log("DetachedTableShow::copyTable");
    tableMan.getTable(a.index, a.id).copy();
    $chk(b) && (b = b.bind(this), b())
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    chrome.extension.sendRequest({url: gDocs.url.ss["new"]}, function (a) {
      console.log("Goog Doc Created!")
    })
  }, highlightTable: function (a) {
    tableMan.getTable(a.index, a.id).highlight()
  }, unhighlightTable: function (a) {
    tableMan.getTable(a.index, a.id).unhighlight()
  }, removeFromPage: function () {
    this.dom.wrapper.remove()
  }
});
function init() {
  var a = {
    actions: [{key: "goog", pretty: chrome.i18n.getMessage("googleDocAction")}, {
      key: "copy",
      pretty: chrome.i18n.getMessage("copyClipboardAction")
    }], sorts: [], page: {size: 5}, displayInline: !1
  };
  tableShow = new TableShow($(document.body), a)
}
function destroy() {
  $chk(tableShow) && (tableShow.destroy(), tableShow = null)
}
window.addEvent("domready", init);
gDocs = {
  base: "",
  api: "",
  url: {ss: {"new": "http://spreadsheets.google.com/ccc?new=true", test: "http://localhost/g/dev/sig/table2doc/test/"}}
};
DisplayUtil = {
  setNewlyCreatedTab: function (a) {
    Cookie.set("tableCaptureTab", a, {duration: 183, path: chrome.extension.getURL("/")})
  }
};
TableShow = new Class({
  cbs: null, data: null, settings: null, state: null, dom: null, initialize: function (a, b) {
    this.settings = b;
    this.state = {page: 0};
    this.dom = {wrapper: a};
    this.initCallbacks();
    this.refresh()
  }, initCallbacks: function () {
    this.cbs = {
      highlight: this.highlightTable,
      unhighlight: this.unhighlightTable,
      copy: this.copyTable,
      goog: this.googTable
    }
  }, getTableDefs: function () {
    return chrome.extension.getBackgroundPage().tableDefs
  }, display: function () {
    this.dom.wrapper.empty();
    var a = this.getTableDefs();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a).adopt(this.getAd())
  }, getAd: function () {
    var a = new Element("fieldset", {"class": "_tc_footer_ad"}), b = (new Element("legend", {})).setHTML("Shameless self-promotion"), c = (new Element("a", {
      href: "http://presentio.us/",
      events: {
        click: function () {
          chrome.tabs.create({url: "http://presentio.us/"});
          return !1
        }
      }
    })).setHTML("Try Presentious"), d = (new Element("span", {})).setHTML(": The easiest and most effective way to share live presentations!");
    a.adopt(b).adopt(c).adopt(d);
    return a
  }, displayHeader: function (a) {
    var b = new Element("div", {"class": "_tc_header"});
    b.adopt(this.displayHeaderActionWrap()).adopt(this.displayHeaderTitle(a));
    return b
  }, displayHeaderTitle: function (a) {
    return (new Element("div", {"class": "_tc_title"})).setHTML(chrome.i18n.getMessage("tablesFoundTitle", [a]))
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"), "class": "header_action",
      id: "refresh_action", events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("detachPaneDescription"),
      "class": "header_action",
      id: "inpage_action",
      events: {click: this.inPageDisplay.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("detachPaneAction")), d = (new Element("a", {
      title: chrome.i18n.getMessage("inlineDescription"),
      "class": "header_action",
      id: "inline_action",
      events: {click: this.inLineDisplay.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("inlineAction"));
    a.adopt(d).adopt(c).adopt(b);
    return a
  }, displayTableList: function (a) {
    var b = new Element("ol", {"class": "_tc_table_list"});
    a.each(function (a) {
      try {
        var d = new Element("li", {
          id: a.table.id,
          "class": "table_def_el",
          events: {
            mouseenter: this.callbackCheck.bindWithEvent(this, [a, "highlight"]),
            mouseleave: this.callbackCheck.bindWithEvent(this, [a, "unhighlight"])
          }
        });
        d.adopt((new Element("span", {title: a.table.id, "class": "non_action"})).setHTML(a.table.adjusted));
        $each(this.settings.actions, function (b) {
          d.adopt((new Element("a",
            {
              "class": "action action_" + b.key,
              events: {click: this.callbackCheck.bindWithEvent(this, [a, b.key])}
            })).setHTML(b.pretty))
        }, this);
        b.adopt(d)
      } catch (e) {
      }
    }, this);
    return b
  }, displayLoader: function () {
    this.dom.wrapper.adopt(new Element("img", {src: chrome.extension.getURL("/") + "images/loader.gif"}))
  }, callbackCheck: function (a, b, c) {
    try {
      this.cbs[c].bind(this)(b)
    } catch (d) {
    }
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    var a = chrome.extension.getBackgroundPage(), b = a.selectedId;
    chrome.tabs.sendRequest(b,
      {action: "refresh"}, function (c) {
        a.updateWithTables(b, c);
        setTimeout(this.display.bind(this), 250)
      }.bind(this))
  }, clear: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "clear"}, function (a) {
    })
  }, destroy: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "destroy"}, function (a) {
    })
  }, copyTable: function (a, b) {
    var c = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(c, {
      action: "copy", id: a.table.id,
      index: a.index
    }, function (a) {
      $chk(b) && (b = b.bind(this), b())
    })
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    console.log("TableShow::googDocCreate");
    chrome.tabs.create({selected: !0, url: gDocs.url.ss["new"]}, function (a) {
      DisplayUtil.setNewlyCreatedTab(a.id)
    })
  }, highlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "highlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, unhighlightTable: function (a) {
    var b =
      chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "unhighlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, inPageDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inpage"}, function (a) {
      window.close()
    })
  }, inLineDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inline"}, function (a) {
      window.close()
    })
  }
});
DetachedTableShow = TableShow.extend({
  initialize: function (a, b) {
    var c = new Element("div", {"class": "_tc_detachedWrapper", id: "tableWrapper_detached"});
    b.displayInline || a.adopt(c);
    this.parent(c, b)
  }, getTableDefs: function () {
    var a = [];
    try {
      a = tableMan.getTableDefs()
    } catch (b) {
    }
    return a
  }, display: function () {
    var a = this.getTableDefs();
    this.settings.displayInline ? (this.dom.wrapper.addClass("_tc_offscreeneded"), this.displayInlineMenu(a)) : this.displayDetachedMenu(a)
  }, displayInlineMenu: function (a) {
    a.each(function (a) {
      var c =
        tableMan.getTable(a.index, a.id);
      a = {
        actions: [{
          className: "action_copy",
          text: chrome.i18n.getMessage("copyClipboardAction"),
          cb: function (a, b) {
            this.copyTable(b)
          }.bindWithEvent(this, [a])
        }, {
          className: "action_goog", text: chrome.i18n.getMessage("googleDocAction"), cb: function (a, b) {
            this.googTable(b)
          }.bindWithEvent(this, [a])
        }]
      };
      c.applyInlineMenu(a)
    }, this)
  }, displayDetachedMenu: function (a) {
    this.dom.wrapper.empty();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a);
    new Drag.Move(this.dom.wrapper, {handle: this.dom.header})
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"),
      "class": "header_action",
      id: "refresh_action",
      events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("removeDetachedDescription"),
      "class": "header_action",
      id: "remove_action",
      events: {
        click: function (a) {
          this.removeFromPage();
          this.destroy()
        }.bindWithEvent(this)
      }
    })).setHTML(chrome.i18n.getMessage("removeAction"));
    a.adopt(c).adopt(b);
    return a
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    tableMan.destroy();
    tableMan.findTables();
    setTimeout(this.display.bind(this), 500)
  }, clear: function () {
    tableMan.clear()
  }, destroy: function () {
    tableMan && (tableMan.destroy(), tableMan = null)
  }, copyTable: function (a, b) {
    console.log("DetachedTableShow::copyTable");
    tableMan.getTable(a.index, a.id).copy();
    $chk(b) && (b = b.bind(this), b())
  },
  googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    chrome.extension.sendRequest({url: gDocs.url.ss["new"]}, function (a) {
      console.log("Goog Doc Created!")
    })
  }, highlightTable: function (a) {
    tableMan.getTable(a.index, a.id).highlight()
  }, unhighlightTable: function (a) {
    tableMan.getTable(a.index, a.id).unhighlight()
  }, removeFromPage: function () {
    this.dom.wrapper.remove()
  }
});

function init() {
  var a = {
    actions: [{key: "goog", pretty: chrome.i18n.getMessage("googleDocAction")}, {
      key: "copy",
      pretty: chrome.i18n.getMessage("copyClipboardAction")
    }], sorts: [], page: {size: 5}, displayInline: !1
  };
  tableShow = new TableShow($(document.body), a)
}
function destroy() {
  $chk(tableShow) && (tableShow.destroy(), tableShow = null)
}
window.addEvent("domready", init);
var gDocs = {
  base: "",
  api: "",
  url: {ss: {"new": "http://spreadsheets.google.com/ccc?new=true", test: "http://localhost/g/dev/sig/table2doc/test/"}}
}, DisplayUtil = {
  setNewlyCreatedTab: function (a) {
    Cookie.set("tableCaptureTab", a, {duration: 183, path: chrome.extension.getURL("/")})
  }
}, TableShow = new Class({
  cbs: null, data: null, settings: null, state: null, dom: null, initialize: function (a, b) {
    this.settings = b;
    this.state = {page: 0};
    this.dom = {wrapper: a};
    this.initCallbacks();
    this.refresh()
  }, initCallbacks: function () {
    this.cbs = {
      highlight: this.highlightTable,
      unhighlight: this.unhighlightTable, copy: this.copyTable, goog: this.googTable
    }
  }, getTableDefs: function () {
    return chrome.extension.getBackgroundPage().tableDefs
  }, display: function () {
    this.dom.wrapper.empty();
    var a = this.getTableDefs();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a).adopt(this.getAd())
  }, getAd: function () {
    var a = new Element("fieldset", {"class": "_tc_footer_ad"}), b = (new Element("legend", {})).setHTML("Shameless self-promotion"),
      c = (new Element("a", {
        href: "http://presentio.us/", events: {
          click: function () {
            chrome.tabs.create({url: "http://presentio.us/"});
            return !1
          }
        }
      })).setHTML("Try Presentious"), d = (new Element("span", {})).setHTML(": The easiest and most effective way to share live presentations!");
    a.adopt(b).adopt(c).adopt(d);
    return a
  }, displayHeader: function (a) {
    var b = new Element("div", {"class": "_tc_header"});
    b.adopt(this.displayHeaderActionWrap()).adopt(this.displayHeaderTitle(a));
    return b
  }, displayHeaderTitle: function (a) {
    return (new Element("div",
      {"class": "_tc_title"})).setHTML(chrome.i18n.getMessage("tablesFoundTitle", [a]))
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
        title: chrome.i18n.getMessage("refreshDescription"),
        "class": "header_action",
        id: "refresh_action",
        events: {click: this.refresh.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
        title: chrome.i18n.getMessage("detachPaneDescription"),
        "class": "header_action",
        id: "inpage_action",
        events: {click: this.inPageDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("detachPaneAction")),
      d = (new Element("a", {
        title: chrome.i18n.getMessage("inlineDescription"),
        "class": "header_action",
        id: "inline_action",
        events: {click: this.inLineDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("inlineAction"));
    a.adopt(d).adopt(c).adopt(b);
    return a
  }, displayTableList: function (a) {
    var b = new Element("ol", {"class": "_tc_table_list"});
    a.each(function (a) {
      try {
        var d = new Element("li", {
          id: a.table.id, "class": "table_def_el", events: {
            mouseenter: this.callbackCheck.bindWithEvent(this, [a, "highlight"]),
            mouseleave: this.callbackCheck.bindWithEvent(this,
              [a, "unhighlight"])
          }
        });
        d.adopt((new Element("span", {title: a.table.id, "class": "non_action"})).setHTML(a.table.adjusted));
        $each(this.settings.actions, function (b) {
          d.adopt((new Element("a", {
            "class": "action action_" + b.key,
            events: {click: this.callbackCheck.bindWithEvent(this, [a, b.key])}
          })).setHTML(b.pretty))
        }, this);
        b.adopt(d)
      } catch (e) {
      }
    }, this);
    return b
  }, displayLoader: function () {
    this.dom.wrapper.adopt(new Element("img", {src: chrome.extension.getURL("/") + "images/loader.gif"}))
  }, callbackCheck: function (a, b, c) {
    try {
      this.cbs[c].bind(this)(b)
    } catch (d) {
    }
  },
  refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    var a = chrome.extension.getBackgroundPage(), b = a.selectedId;
    chrome.tabs.sendRequest(b, {action: "refresh"}, function (c) {
      a.updateWithTables(b, c);
      setTimeout(this.display.bind(this), 250)
    }.bind(this))
  }, clear: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "clear"}, function (a) {
    })
  }, destroy: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "destroy"},
      function (a) {
      })
  }, copyTable: function (a, b) {
    var c = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(c, {action: "copy", id: a.table.id, index: a.index}, function (a) {
      $chk(b) && (b = b.bind(this), b())
    })
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    console.log("TableShow::googDocCreate");
    chrome.tabs.create({selected: !0, url: gDocs.url.ss["new"]}, function (a) {
      DisplayUtil.setNewlyCreatedTab(a.id)
    })
  }, highlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "highlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, unhighlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "unhighlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, inPageDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inpage"}, function (a) {
      window.close()
    })
  }, inLineDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a,
      {action: "inline"}, function (a) {
        window.close()
      })
  }
}), DetachedTableShow = TableShow.extend({
  initialize: function (a, b) {
    var c = new Element("div", {"class": "_tc_detachedWrapper", id: "tableWrapper_detached"});
    b.displayInline || a.adopt(c);
    this.parent(c, b)
  }, getTableDefs: function () {
    var a = [];
    try {
      a = tableMan.getTableDefs()
    } catch (b) {
    }
    return a
  }, display: function () {
    var a = this.getTableDefs();
    this.settings.displayInline ? (this.dom.wrapper.addClass("_tc_offscreeneded"), this.displayInlineMenu(a)) : this.displayDetachedMenu(a)
  },
  displayInlineMenu: function (a) {
    a.each(function (a) {
      var c = tableMan.getTable(a.index, a.id);
      a = {
        actions: [{
          className: "action_copy",
          text: chrome.i18n.getMessage("copyClipboardAction"),
          cb: function (a, b) {
            this.copyTable(b)
          }.bindWithEvent(this, [a])
        }, {
          className: "action_goog", text: chrome.i18n.getMessage("googleDocAction"), cb: function (a, b) {
            this.googTable(b)
          }.bindWithEvent(this, [a])
        }]
      };
      c.applyInlineMenu(a)
    }, this)
  }, displayDetachedMenu: function (a) {
    this.dom.wrapper.empty();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a);
    new Drag.Move(this.dom.wrapper, {handle: this.dom.header})
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"),
      "class": "header_action",
      id: "refresh_action",
      events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("removeDetachedDescription"),
      "class": "header_action", id: "remove_action", events: {
        click: function (a) {
          this.removeFromPage();
          this.destroy()
        }.bindWithEvent(this)
      }
    })).setHTML(chrome.i18n.getMessage("removeAction"));
    a.adopt(c).adopt(b);
    return a
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    tableMan.destroy();
    tableMan.findTables();
    setTimeout(this.display.bind(this), 500)
  }, clear: function () {
    tableMan.clear()
  }, destroy: function () {
    tableMan && (tableMan.destroy(), tableMan = null)
  }, copyTable: function (a, b) {
    console.log("DetachedTableShow::copyTable");
    tableMan.getTable(a.index, a.id).copy();
    $chk(b) && (b = b.bind(this), b())
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    chrome.extension.sendRequest({url: gDocs.url.ss["new"]}, function (a) {
      console.log("Goog Doc Created!")
    })
  }, highlightTable: function (a) {
    tableMan.getTable(a.index, a.id).highlight()
  }, unhighlightTable: function (a) {
    tableMan.getTable(a.index, a.id).unhighlight()
  }, removeFromPage: function () {
    this.dom.wrapper.remove()
  }
});
function init() {
  var a = {
    actions: [{key: "goog", pretty: chrome.i18n.getMessage("googleDocAction")}, {
      key: "copy",
      pretty: chrome.i18n.getMessage("copyClipboardAction")
    }], sorts: [], page: {size: 5}, displayInline: !1
  };
  tableShow = new TableShow($(document.body), a)
}
function destroy() {
  $chk(tableShow) && (tableShow.destroy(), tableShow = null)
}
window.addEvent("domready", init);
gDocs = {
  base: "",
  api: "",
  url: {ss: {"new": "http://spreadsheets.google.com/ccc?new=true", test: "http://localhost/g/dev/sig/table2doc/test/"}}
};
DisplayUtil = {
  setNewlyCreatedTab: function (a) {
    Cookie.set("tableCaptureTab", a, {duration: 183, path: chrome.extension.getURL("/")})
  }
};
TableShow = new Class({
  cbs: null, data: null, settings: null, state: null, dom: null, initialize: function (a, b) {
    this.settings = b;
    this.state = {page: 0};
    this.dom = {wrapper: a};
    this.initCallbacks();
    this.refresh()
  }, initCallbacks: function () {
    this.cbs = {
      highlight: this.highlightTable,
      unhighlight: this.unhighlightTable,
      copy: this.copyTable,
      goog: this.googTable
    }
  }, getTableDefs: function () {
    return chrome.extension.getBackgroundPage().tableDefs
  }, display: function () {
    this.dom.wrapper.empty();
    var a = this.getTableDefs();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a).adopt(this.getAd())
  }, getAd: function () {
    var a = new Element("fieldset", {"class": "_tc_footer_ad"}), b = (new Element("legend", {})).setHTML("Shameless self-promotion"), c = (new Element("a", {
      href: "http://presentio.us/",
      events: {
        click: function () {
          chrome.tabs.create({url: "http://presentio.us/"});
          return !1
        }
      }
    })).setHTML("Try Presentious"), d = (new Element("span", {})).setHTML(": The easiest and most effective way to share live presentations!");
    a.adopt(b).adopt(c).adopt(d);
    return a
  }, displayHeader: function (a) {
    var b = new Element("div", {"class": "_tc_header"});
    b.adopt(this.displayHeaderActionWrap()).adopt(this.displayHeaderTitle(a));
    return b
  }, displayHeaderTitle: function (a) {
    return (new Element("div", {"class": "_tc_title"})).setHTML(chrome.i18n.getMessage("tablesFoundTitle", [a]))
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"), "class": "header_action",
      id: "refresh_action", events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("detachPaneDescription"),
      "class": "header_action",
      id: "inpage_action",
      events: {click: this.inPageDisplay.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("detachPaneAction")), d = (new Element("a", {
      title: chrome.i18n.getMessage("inlineDescription"),
      "class": "header_action",
      id: "inline_action",
      events: {click: this.inLineDisplay.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("inlineAction"));
    a.adopt(d).adopt(c).adopt(b);
    return a
  }, displayTableList: function (a) {
    var b = new Element("ol", {"class": "_tc_table_list"});
    a.each(function (a) {
      try {
        var d = new Element("li", {
          id: a.table.id,
          "class": "table_def_el",
          events: {
            mouseenter: this.callbackCheck.bindWithEvent(this, [a, "highlight"]),
            mouseleave: this.callbackCheck.bindWithEvent(this, [a, "unhighlight"])
          }
        });
        d.adopt((new Element("span", {title: a.table.id, "class": "non_action"})).setHTML(a.table.adjusted));
        $each(this.settings.actions, function (b) {
          d.adopt((new Element("a",
            {
              "class": "action action_" + b.key,
              events: {click: this.callbackCheck.bindWithEvent(this, [a, b.key])}
            })).setHTML(b.pretty))
        }, this);
        b.adopt(d)
      } catch (e) {
      }
    }, this);
    return b
  }, displayLoader: function () {
    this.dom.wrapper.adopt(new Element("img", {src: chrome.extension.getURL("/") + "images/loader.gif"}))
  }, callbackCheck: function (a, b, c) {
    try {
      this.cbs[c].bind(this)(b)
    } catch (d) {
    }
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    var a = chrome.extension.getBackgroundPage(), b = a.selectedId;
    chrome.tabs.sendRequest(b,
      {action: "refresh"}, function (c) {
        a.updateWithTables(b, c);
        setTimeout(this.display.bind(this), 250)
      }.bind(this))
  }, clear: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "clear"}, function (a) {
    })
  }, destroy: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "destroy"}, function (a) {
    })
  }, copyTable: function (a, b) {
    var c = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(c, {
      action: "copy", id: a.table.id,
      index: a.index
    }, function (a) {
      $chk(b) && (b = b.bind(this), b())
    })
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    console.log("TableShow::googDocCreate");
    chrome.tabs.create({selected: !0, url: gDocs.url.ss["new"]}, function (a) {
      DisplayUtil.setNewlyCreatedTab(a.id)
    })
  }, highlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "highlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, unhighlightTable: function (a) {
    var b =
      chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "unhighlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, inPageDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inpage"}, function (a) {
      window.close()
    })
  }, inLineDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inline"}, function (a) {
      window.close()
    })
  }
});
DetachedTableShow = TableShow.extend({
  initialize: function (a, b) {
    var c = new Element("div", {"class": "_tc_detachedWrapper", id: "tableWrapper_detached"});
    b.displayInline || a.adopt(c);
    this.parent(c, b)
  }, getTableDefs: function () {
    var a = [];
    try {
      a = tableMan.getTableDefs()
    } catch (b) {
    }
    return a
  }, display: function () {
    var a = this.getTableDefs();
    this.settings.displayInline ? (this.dom.wrapper.addClass("_tc_offscreeneded"), this.displayInlineMenu(a)) : this.displayDetachedMenu(a)
  }, displayInlineMenu: function (a) {
    a.each(function (a) {
      var c =
        tableMan.getTable(a.index, a.id);
      a = {
        actions: [{
          className: "action_copy",
          text: chrome.i18n.getMessage("copyClipboardAction"),
          cb: function (a, b) {
            this.copyTable(b)
          }.bindWithEvent(this, [a])
        }, {
          className: "action_goog", text: chrome.i18n.getMessage("googleDocAction"), cb: function (a, b) {
            this.googTable(b)
          }.bindWithEvent(this, [a])
        }]
      };
      c.applyInlineMenu(a)
    }, this)
  }, displayDetachedMenu: function (a) {
    this.dom.wrapper.empty();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a);
    new Drag.Move(this.dom.wrapper, {handle: this.dom.header})
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"),
      "class": "header_action",
      id: "refresh_action",
      events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("removeDetachedDescription"),
      "class": "header_action",
      id: "remove_action",
      events: {
        click: function (a) {
          this.removeFromPage();
          this.destroy()
        }.bindWithEvent(this)
      }
    })).setHTML(chrome.i18n.getMessage("removeAction"));
    a.adopt(c).adopt(b);
    return a
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    tableMan.destroy();
    tableMan.findTables();
    setTimeout(this.display.bind(this), 500)
  }, clear: function () {
    tableMan.clear()
  }, destroy: function () {
    tableMan && (tableMan.destroy(), tableMan = null)
  }, copyTable: function (a, b) {
    console.log("DetachedTableShow::copyTable");
    tableMan.getTable(a.index, a.id).copy();
    $chk(b) && (b = b.bind(this), b())
  },
  googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    chrome.extension.sendRequest({url: gDocs.url.ss["new"]}, function (a) {
      console.log("Goog Doc Created!")
    })
  }, highlightTable: function (a) {
    tableMan.getTable(a.index, a.id).highlight()
  }, unhighlightTable: function (a) {
    tableMan.getTable(a.index, a.id).unhighlight()
  }, removeFromPage: function () {
    this.dom.wrapper.remove()
  }
});


var Clipboard = {
  copy: function (a) {
    null !== a && (a = Clipboard.utilities.createTextArea(a), a.select(), document.execCommand("Copy"), document.body.removeChild(a))
  }, utilities: {
    createTextArea: function (a) {
      var b = new Element("textarea", {"class": "offscreeneded"});
      null !== a && (b.value = a);
      document.body.appendChild(b);
      return b
    }
  }
}, tableMan, inPageTableShow, tableManConfig = {}, copyConst = {rowSeperator: "\r\n", colSeperator: "\t"};
function inPageInit(a) {
  a = {
    actions: [{key: "goog", pretty: chrome.i18n.getMessage("googleDocAction")}, {
      key: "copy",
      pretty: chrome.i18n.getMessage("copyClipboardAction")
    }], sorts: [], page: {size: 5}, displayInline: a
  };
  inPageTableShow = new DetachedTableShow($(document.body), a)
}
function initTableMan() {
  tableMan = new TableManager(tableManConfig)
}
var TableUtil = {
  nodeToString: function (a, b, c) {
    var d = "";
    if (a.childNodes.length) {
      if ("TD" == a.nodeName || "TH" == a.nodeName)c = b = "";
      for (a = a.firstChild; a;) {
        d += TableUtil.nodeToString(a, b, c);
        if ("TR" == a.nodeName)d += b; else if ("TD" == a.nodeName || "TH" == a.nodeName)d += c;
        a = a.nextSibling
      }
    } else"#text" == a.nodeName && $chk(a.nodeValue) && "" !== a.nodeValue && (b = a.nodeValue, c = RegExp("\\t", "g"), b = b.replace(RegExp("\\n", "g"), ""), b = b.replace(c, ""), d += b.trim());
    return d
  }
}, TableWrapper = new Class({
  dom: null, def: null, state: null, settings: null,
  initialize: function (a) {
    this.dom = {table: a};
    this.def = {};
    this.state = {};
    this.settings = {};
    this.define()
  }, define: function () {
    var a = this.dom.table, b = a.getProperty("id"), c = a.getProperty("name"), d = a.getProperty("class"), f = [], g = a.getElementsByTagName("TR"), a = g.length, e = 0;
    if (0 !== a) {
      e = g[0].getElementsByTagName("TH");
      if (0 === e.length)e = g[0].getElementsByTagName("TD"); else if (e.length)try {
        e.each(function (a) {
          f.push(TableUtil.nodeToString(a, "", ""))
        })
      } catch (h) {
      }
      e = e.length
    }
    if (null === b || "" === b)b = "", [c, d].each(function (a) {
      null !==
      a && "" !== a && (b.length && (b += ", "), b += a)
    });
    c = b;
    17 < c.length && (c = c.substring(0, 16) + "...");
    d = "(" + a + " x " + e + ") ";
    this.def = {table: {id: d + b, adjusted: d + c, rows: a, columns: e, headers: f}, state: {}, settings: {}}
  }, destroy: function () {
    this.unhighlight();
    this.removeInlineMenu();
    this.dom.table = null
  }, toJSON: function () {
    return this.def
  }, applyInlineMenu: function (a) {
    this.dom.table.addEvent("mouseenter", this.displayInlineMenu.bindWithEvent(this, [a]));
    this.dom.table.addEvent("mouseleave", this.hideInlineMenu.bindWithEvent(this));
    this.dom.inline = {}
  }, removeInlineMenu: function () {
    try {
      this.dom.table.removeEvents("mouseenter"), this.dom.table.removeEvents("mouseleave"), $chk(this.dom.inline) && $chk(this.dom.inline.menu) && this.dom.inline.menu.remove()
    } catch (a) {
    }
  }, displayInlineMenu: function (a, b) {
    $chk(this.dom.inline.menu) ? this.dom.inline.menu.removeClass("_tc_offscreeneded") : this.createInlineMenu(b);
    var c = this.dom.table.getCoordinates();
    this.dom.inline.menu.setStyles({top: c.top + 8 + "px", left: c.left + 8 + "px"})
  }, createInlineMenu: function (a) {
    var b =
      new Element("ul", {"class": "_tc_inline_table_action_menu"});
    a.actions.each(function (a) {
      b.adopt((new Element("li", {"class": a.className, events: {click: a.cb}})).setHTML(a.text))
    });
    b.adopt((new Element("li", {
      title: chrome.i18n.getMessage("removeInlineDescription"),
      "class": "action_remove",
      events: {click: this.removeInlineMenu.bindWithEvent(this)}
    })).setHTML("&#215;"));
    this.dom.inline.menu = b;
    document.body.adopt(this.dom.inline.menu)
  }, hideInlineMenu: function (a) {
    try {
      var b = new Event(a);
      if (b.relatedTarget == this.dom.inline.menu ||
        this.dom.inline.menu.hasChild(b.relatedTarget))return !0;
      this.dom.table.hasChild(b.target);
      this.dom.inline.menu.addClass("_tc_offscreeneded");
      this.dom.inline.menu.setStyles({top: "-1000px", left: "-1000px"})
    } catch (c) {
    }
    return !0
  }, scrollTo: function () {
    document.body.scrollTop = this.dom.table.offsetTop
  }, select: function () {
    this.dom.table.addClass("_tc_table_selected");
    this.scrollTo()
  }, deselect: function () {
    this.dom.table.removeClass("_tc_table_selected")
  }, highlight: function () {
    this.dom.table.addClass("_tc_table_highlighted");
    this.scrollTo()
  }, highlightPostCopy: function () {
    var a = this.dom.table;
    a.addClass("_tc_just_highlighted");
    setTimeout(function () {
      a.removeClass("_tc_just_highlighted")
    }, 250)
  }, unhighlight: function () {
    this.dom.table.removeClass("_tc_table_highlighted")
  }, copy: function () {
    console.log("TableWrapper::copy(initiated)");
    var a = {
      action: "copy",
      tableString: TableUtil.nodeToString(this.dom.table, copyConst.rowSeperator, copyConst.colSeperator)
    };
    chrome.extension.sendRequest(a, function (a) {
      console.log("TableWrapper::copy(complete)");
      this.highlightPostCopy()
    }.bind(this))
  }
}), TableManager = new Class({
  tables: null, settings: null, initialize: function (a) {
    this.settings = a;
    this.tables = []
  }, destroy: function () {
    console.log("TableManager::destroy()");
    this.tables.each(function (a) {
      a.destroy()
    });
    this.tables.splice(0, this.tables.length)
  }, clear: function () {
    console.log("TableManager::clear()");
    this.tables.each(function (a) {
      a.unhighlight()
    })
  }, getTableDefs: function () {
    var a = [];
    this.tables.each(function (b) {
      b = b.toJSON();
      b.index = a.length;
      a.push(b)
    });
    return a
  },
  findTables: function () {
    console.log("TableManager::findTables()");
    $ES("table").each(function (a) {
      a = new TableWrapper(a);
      this.tables.push(a)
    }, this)
  }, getTable: function (a, b) {
    return this.tables[a]
  }
});
window == top && (tableMan || initTableMan(), chrome.extension.onRequest.addListener(function (a, b, c) {
  tableMan || initTableMan();
  if ($chk(a.action)) {
    if ("paste" == a.action) {
      console.log("Request::Paste!");
      setTimeout(function () {
        document.execCommand("Paste") || alert(chrome.i18n.getMessage("pasteToCaptureMessage"))
      }, 250);
      c([]);
      return
    }
    if ("clear" == a.action) {
      tableMan.clear();
      c({});
      return
    }
    if ("destroy" == a.action) {
      tableMan.destroy();
      tableMan = null;
      c({});
      return
    }
    if ("init" == a.action || "refresh" == a.action) {
      "refresh" == a.action &&
      tableMan.destroy();
      tableMan.findTables();
      a = tableMan.getTableDefs();
      c(a);
      return
    }
    if ("inpage" == a.action || "inline" == a.action) {
      inPageInit("inline" == a.action);
      c({});
      return
    }
    b = tableMan.getTable(a.index, a.id);
    "highlight" == a.action ? b.highlight() : "unhighlight" == a.action ? b.unhighlight() : "copy" == a.action ? b.copy() : "goog" == a.action && b.goog()
  }
  c({})
}));
var gDocs = {
  base: "",
  api: "",
  url: {ss: {"new": "http://spreadsheets.google.com/ccc?new=true", test: "http://localhost/g/dev/sig/table2doc/test/"}}
}, DisplayUtil = {
  setNewlyCreatedTab: function (a) {
    Cookie.set("tableCaptureTab", a, {duration: 183, path: chrome.extension.getURL("/")})
  }
}, TableShow = new Class({
  cbs: null, data: null, settings: null, state: null, dom: null, initialize: function (a, b) {
    this.settings = b;
    this.state = {page: 0};
    this.dom = {wrapper: a};
    this.initCallbacks();
    this.refresh()
  }, initCallbacks: function () {
    this.cbs = {
      highlight: this.highlightTable,
      unhighlight: this.unhighlightTable, copy: this.copyTable, goog: this.googTable
    }
  }, getTableDefs: function () {
    return chrome.extension.getBackgroundPage().tableDefs
  }, display: function () {
    this.dom.wrapper.empty();
    var a = this.getTableDefs();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a).adopt(this.getAd())
  }, getAd: function () {
    var a = new Element("fieldset", {"class": "_tc_footer_ad"}), b = (new Element("legend", {})).setHTML("Shameless self-promotion"),
      c = (new Element("a", {
        href: "http://presentio.us/", events: {
          click: function () {
            chrome.tabs.create({url: "http://presentio.us/"});
            return !1
          }
        }
      })).setHTML("Try Presentious"), d = (new Element("span", {})).setHTML(": The easiest and most effective way to share live presentations!");
    a.adopt(b).adopt(c).adopt(d);
    return a
  }, displayHeader: function (a) {
    var b = new Element("div", {"class": "_tc_header"});
    b.adopt(this.displayHeaderActionWrap()).adopt(this.displayHeaderTitle(a));
    return b
  }, displayHeaderTitle: function (a) {
    return (new Element("div",
      {"class": "_tc_title"})).setHTML(chrome.i18n.getMessage("tablesFoundTitle", [a]))
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
        title: chrome.i18n.getMessage("refreshDescription"),
        "class": "header_action",
        id: "refresh_action",
        events: {click: this.refresh.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
        title: chrome.i18n.getMessage("detachPaneDescription"),
        "class": "header_action",
        id: "inpage_action",
        events: {click: this.inPageDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("detachPaneAction")),
      d = (new Element("a", {
        title: chrome.i18n.getMessage("inlineDescription"),
        "class": "header_action",
        id: "inline_action",
        events: {click: this.inLineDisplay.bindWithEvent(this)}
      })).setHTML(chrome.i18n.getMessage("inlineAction"));
    a.adopt(d).adopt(c).adopt(b);
    return a
  }, displayTableList: function (a) {
    var b = new Element("ol", {"class": "_tc_table_list"});
    a.each(function (a) {
      try {
        var d = new Element("li", {
          id: a.table.id, "class": "table_def_el", events: {
            mouseenter: this.callbackCheck.bindWithEvent(this, [a, "highlight"]),
            mouseleave: this.callbackCheck.bindWithEvent(this,
              [a, "unhighlight"])
          }
        });
        d.adopt((new Element("span", {title: a.table.id, "class": "non_action"})).setHTML(a.table.adjusted));
        $each(this.settings.actions, function (b) {
          d.adopt((new Element("a", {
            "class": "action action_" + b.key,
            events: {click: this.callbackCheck.bindWithEvent(this, [a, b.key])}
          })).setHTML(b.pretty))
        }, this);
        b.adopt(d)
      } catch (f) {
      }
    }, this);
    return b
  }, displayLoader: function () {
    this.dom.wrapper.adopt(new Element("img", {src: chrome.extension.getURL("/") + "images/loader.gif"}))
  }, callbackCheck: function (a, b, c) {
    try {
      this.cbs[c].bind(this)(b)
    } catch (d) {
    }
  },
  refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    var a = chrome.extension.getBackgroundPage(), b = a.selectedId;
    chrome.tabs.sendRequest(b, {action: "refresh"}, function (c) {
      a.updateWithTables(b, c);
      setTimeout(this.display.bind(this), 250)
    }.bind(this))
  }, clear: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "clear"}, function (a) {
    })
  }, destroy: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "destroy"},
      function (a) {
      })
  }, copyTable: function (a, b) {
    var c = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(c, {action: "copy", id: a.table.id, index: a.index}, function (a) {
      $chk(b) && (b = b.bind(this), b())
    })
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    console.log("TableShow::googDocCreate");
    chrome.tabs.create({selected: !0, url: gDocs.url.ss["new"]}, function (a) {
      DisplayUtil.setNewlyCreatedTab(a.id)
    })
  }, highlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "highlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, unhighlightTable: function (a) {
    var b = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(b, {action: "unhighlight", id: a.table.id, index: a.index}, function (a) {
    })
  }, inPageDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a, {action: "inpage"}, function (a) {
      window.close()
    })
  }, inLineDisplay: function () {
    var a = chrome.extension.getBackgroundPage().selectedId;
    chrome.tabs.sendRequest(a,
      {action: "inline"}, function (a) {
        window.close()
      })
  }
}), DetachedTableShow = TableShow.extend({
  initialize: function (a, b) {
    var c = new Element("div", {"class": "_tc_detachedWrapper", id: "tableWrapper_detached"});
    b.displayInline || a.adopt(c);
    this.parent(c, b)
  }, getTableDefs: function () {
    var a = [];
    try {
      a = tableMan.getTableDefs()
    } catch (b) {
    }
    return a
  }, display: function () {
    var a = this.getTableDefs();
    this.settings.displayInline ? (this.dom.wrapper.addClass("_tc_offscreeneded"), this.displayInlineMenu(a)) : this.displayDetachedMenu(a)
  },
  displayInlineMenu: function (a) {
    a.each(function (a) {
      var c = tableMan.getTable(a.index, a.id);
      a = {
        actions: [{
          className: "action_copy",
          text: chrome.i18n.getMessage("copyClipboardAction"),
          cb: function (a, b) {
            this.copyTable(b)
          }.bindWithEvent(this, [a])
        }, {
          className: "action_goog", text: chrome.i18n.getMessage("googleDocAction"), cb: function (a, b) {
            this.googTable(b)
          }.bindWithEvent(this, [a])
        }]
      };
      c.applyInlineMenu(a)
    }, this)
  }, displayDetachedMenu: function (a) {
    this.dom.wrapper.empty();
    this.dom.header = this.displayHeader(a.length);
    a = this.displayTableList(a);
    this.dom.wrapper.adopt(this.dom.header).adopt(a);
    new Drag.Move(this.dom.wrapper, {handle: this.dom.header})
  }, displayHeaderActionWrap: function () {
    var a = new Element("div", {"class": "action_wrap"}), b = (new Element("a", {
      title: chrome.i18n.getMessage("refreshDescription"),
      "class": "header_action",
      id: "refresh_action",
      events: {click: this.refresh.bindWithEvent(this)}
    })).setHTML(chrome.i18n.getMessage("refreshAction")), c = (new Element("a", {
      title: chrome.i18n.getMessage("removeDetachedDescription"),
      "class": "header_action", id: "remove_action", events: {
        click: function (a) {
          this.removeFromPage();
          this.destroy()
        }.bindWithEvent(this)
      }
    })).setHTML(chrome.i18n.getMessage("removeAction"));
    a.adopt(c).adopt(b);
    return a
  }, refresh: function () {
    this.dom.wrapper.empty();
    this.displayLoader();
    tableMan.destroy();
    tableMan.findTables();
    setTimeout(this.display.bind(this), 500)
  }, clear: function () {
    tableMan.clear()
  }, destroy: function () {
    tableMan && (tableMan.destroy(), tableMan = null)
  }, copyTable: function (a, b) {
    console.log("DetachedTableShow::copyTable");
    tableMan.getTable(a.index, a.id).copy();
    $chk(b) && (b = b.bind(this), b())
  }, googTable: function (a) {
    this.copyTable(a, this.googDocCreate)
  }, googDocCreate: function () {
    chrome.extension.sendRequest({url: gDocs.url.ss["new"]}, function (a) {
      console.log("Goog Doc Created!")
    })
  }, highlightTable: function (a) {
    tableMan.getTable(a.index, a.id).highlight()
  }, unhighlightTable: function (a) {
    tableMan.getTable(a.index, a.id).unhighlight()
  }, removeFromPage: function () {
    this.dom.wrapper.remove()
  }
});
