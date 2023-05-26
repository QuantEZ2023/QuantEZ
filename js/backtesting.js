function popupCondition() {
  if (document.getElementById('divPopCond').style.display =='none') {
    document.getElementById('divPopCond').style.display = 'block';
  } else {
    document.getElementById('divPopCond').style.display = 'none';
  }
};

Component.MportUI = {
  loadConditionList: function (ret, data) {
  Component.MportUI.ConditionList = {
    main: [],
    last: {
      buy: [],
      sell: []
    }
  };
  if (ret) {
    // 팩터 목록
    for (var i = 0; i< data[0].length;i++) {
      // 임시로 대상종목구분인 팩터는 나오지 않게 처리
      if (data[0][i].nsMainCategory != "대상종목") {
        Component.MportUI.addConditionList(data[0][i]);
      }
    }
    if (data.length > 1) {
      // 최근 사용한 팩터 목록
      for (var i = 0; i< data[1].length; i++) {
        if (data[1][i].nsOrderType == "BUY") {
          Component.MportUI.ConditionList.last.buy.push(data[1][i]);
        }
        else if (data[1][i].nsOrderType == "SELL") {
          Component.MportUI.ConditionList.last.sell.push(data[1][i]);
        }
      }
    }
  }
},

addConditionList: function (item) {
  // 팩터 목록 생성
  let list = this.ConditionList;
  let nowmain;
  let nowsub;
  let nowitem;

  // main 검색 후 없으면 main 입력
  for (var i = 0; i< list.main.length; i++) {
    if (list.main[i].name == item.nsMainCategory) {
      nowmain = list.main[i];
    }
  }

  if (nowmain == null) {
    nowmain = list.main[list.main.push({
      name: item.nsMainCategory,
      sub: []
    }) -1];
  }

  // sub 검색 후 없으면 sub 입력
  for (var i = 0; i < nowmain.sub.length; i++) {
    if(nowmain.sub[i].name == item.nsSubCategory) {
      nowsub = nowmain.sub[i];
    }
  }

  if (nowsub == null) {
    nowsub = nowmain.sub[nowmain.sub.push({
      name: item.nsSubCategory,
      condition: []
    }) -1];
  }

  // main-sub에 자기 자신 입력 
  for (var i = 0; i < nowsub.condition.length;i++) {
    if (nowsub.condition[i].nsFactorUID == item.nsFactorUID) {
      nowitem = nowsub.condition[i];
    }
  }

  if (nowitem == null) {
    nowsub.condition.push({
      nsFactorUID: item.nsFactorUID,
      nsUseType: item.nsUseType,
      nsName: item.nsName,
      nsMainCategory: item.nsMainCategory,
      nsSubCategory: item.nsSubCategory,
      nsColumn: item.nsColumn,
      nsDescription: item.nsDescription,
      nsOrder: item.nsOrder,
      nsRegDate: item.nsRegDate,
      nsCache: item.nsCache,
      nsPyScript: item.nsPyScript,
      nsBuySell: item.nsBuySell,
      nsLoScript: item.nsLoScript,
      nsUseDefFunc: item.nsUseDefFunc,
      nsParam1: item.nsParam1.toString(),
      nsParam2: item.nsParam2.toString(),
      nsLoName: item.nsName,
      nsValueType: item.nsValueType,
      nsFactorURL: item.nsFactorURL
    });
  }
},

getConditionItem: function(uid) {
  // 팩터 번호에 해당하는 아이템 리턴
  let list = this.ConditionList;
  for (var i = 0; i< list.main.length;i++) {
    for (var j = 0; j < list.main[i].sub.length; j++) {
      for (var k = 0; k < list.main[i].sub[j].condition.length;k++) {
        if(list.main[i].sub[j].condition[k].nsFactorUID == uid) {
          return list.main[i].sub[j].condition[k];
        }
      }
    }
  }
},

setPopupCondition: function (type, searchkey) {
  // 타입과 검색어에 따라 트리를 재구성 한다
  let list = this.ConditionList;
  if (list) {
      this.SearchConditionList = new Array();
      let html = "";
      searchkey = searchkey.toUpperCase();

      // 리스트를 루핑하며 tag 구성
      if (searchkey != '') {
          for (var i = 0; i < list.main.length; i++) {
              for (var j = 0; j < list.main[i].sub.length; j++) {
                  for (var k = 0; k < list.main[i].sub[j].condition.length; k++) {
                      var item = list.main[i].sub[j].condition[k];
                      if (!(type == "sell" && item.nsBuySell == "BUY") && !(type == "buy" && item.nsBuySell == "SELL")) {
                          if (item.nsName.toUpperCase().indexOf(searchkey) >= 0) {
                              html += "<li id='citem" + i.toString() + j.toString() + k.toString() +
                                  "' class='depth1_none' onclick='Component.MPortUI.setPopupConditionDetail(" + item.nsFactorUID + ", this, \"depth1_none\");' " +
                                  "ondblclick='Component.MPortUI.setPopupConditionDetailAndValue(" + item.nsFactorUID + ", this, \"depth1_none\");' >" +
                                  "<span class='infotxt_15px'>" + item.nsName.replace(searchkey, "<span class='bold'>" + searchkey + "</span>") +
                                  "</span></li>";
                              this.SearchConditionList.push({
                                  uid: item.nsFactorUID,
                                  eid: "citem" + i.toString() + j.toString() + k.toString(),
                                  cssname: "depth1_none"
                              });
                          }
                      }
                  }
              }
          }
          if (html == "") { html = "<li class='depth1_none'><span class='infotxt_15px'>검색된 결과가 없습니다.</span></li>"; }
      } else {
          if (list.last.buy.length > 0 || list.last.sell.length > 0) {
              html += "<li class='depth1'><img src='/img/icn_folderOpen.png'><span class='subtitle_15px'>최근 사용한 조건</span></li>";
              if (list.last.buy.length > 0) {
                  html += "<li id='csub10000' onclick='Component.MPortUI.openPopConditionTree(1000, 0, " + list.last.buy.length + ");' class='depth2'>" +
                      "<img id='csubimg10000' src='/img/icn_folderClose.png'><span class='subtitle_15px'>매수 조건</span></li>";
                  for (var i = 0; i < list.last.buy.length; i++) {
                      html += "<li id='citem10000" + i + "' class='depth3' style='display:none' onclick='Component.MPortUI.setPopupConditionValue(\"buy\"," + i + ");'>"
                          + "<span class='infotxt_15px'>" + list.last.buy[i].nsExpr + " " + list.last.buy[i].nsOperator + " " + list.last.buy[i].nsValue + "</span></li>";
                  }
              }
              if (list.last.sell.length > 0) {
                  html += "<li id='csub20000' onclick='Component.MPortUI.openPopConditionTree(2000, 0, " + list.last.sell.length + ");' class='depth2'>" +
                      "<img id='csubimg20000' src='/img/icn_folderClose.png'><span class='subtitle_15px'>매도 조건</span></li>";
                  for (var i = 0; i < list.last.sell.length; i++) {
                      html += "<li id='citem20000" + i + "' class='depth3' style='display:none' onclick='Component.MPortUI.setPopupConditionValue(\"sell\"," + i + ");'>"
                          + "<span class='infotxt_15px'>" + list.last.sell[i].nsExpr + " " + list.last.sell[i].nsOperator + " " + list.last.sell[i].nsValue + "</span></li>";
                  }
              }
          }
          for (var i = 0; i < list.main.length; i++) {
              html += "<li id='cmain" + i.toString() + "' class='depth1'><img src='/img/icn_folderOpen.png'><span class='subtitle_15px'>" + list.main[i].name + "</span></li>";
              for (var j = 0; j < list.main[i].sub.length; j++) {
                  html += "<li id='csub" + i.toString() + j.toString() + "' class='depth2' onclick='Component.MPortUI.openPopConditionTree(" + i + ", " + j + ", " + list.main[i].sub[j].condition.length + ");'>" +
                      "<span class='infotxt_15px'><img id='csubimg" + i.toString() + j.toString() + "' src='/img/icn_folderClose.png'>" + list.main[i].sub[j].name + "</span></li>";
                  for (var k = 0; k < list.main[i].sub[j].condition.length; k++) {
                      var item = list.main[i].sub[j].condition[k];

                      if (type == 'buyorder' && (item.nsFactorUID == 143 || item.nsFactorUID == 144))
                          continue;

                      if (type == 'buyorder2' && (item.nsFactorUID == 143 || item.nsFactorUID == 144))
                          continue;

                      if (!(type == "sell" && item.nsBuySell == "BUY") && !(type == "buy" && item.nsBuySell == "SELL")) {
                          html += "<li id='citem" + i.toString() + j.toString() + k.toString() + "' class='depth3' " +
                              "onclick='Component.MPortUI.setPopupConditionDetail(" + item.nsFactorUID + ", this, \"depth3\");' " +
                              "ondblclick='Component.MPortUI.setPopupConditionDetailAndValue(" + item.nsFactorUID + ", this, \"depth3\");' " +
                              "style='display:none'><span class='infotxt_15px'>" + item.nsName + "</span></li>";
                      }
                  }
              }
          }
      }

      // 완성된 tag 출력
      $("#ConditionTree").html(html);
  }
},

setPopupConditionValue: function (type, num) {
  let list;
  if (type == "buy") {
      list = Component.MPortUI.ConditionList.last.buy;
  } else if (type == "sell") {
      list = Component.MPortUI.ConditionList.last.sell;
  }

  if (list[num]) {
      $("#ConditionLeft").val(list[num].nsExpr);
      $("#ConditionOperator").val(list[num].nsOperator);
      $("#ConditionRight").val(list[num].nsValue);
  }
},

setPopupConditionDetailAndValue: function (uid, obj, cssname) {
  Component.MPortUI.setPopupConditionDetail(uid, obj, cssname);
  Component.MPortUI.setPopupConditionText(uid);
  document.getElementById("ConditionRight").focus();
},

setPopupConditionDetail: function (uid, obj, cssname) {
  if (this.SearchConditionList.length > 0) {
      for (var i = 0; i < this.SearchConditionList.length; i++) {
          if (this.SearchConditionList[i].uid == uid) {
              this.NowNum = i;
          }
      }
  }

  // 좌측 트리 선택 처리
  if (this.SelectedCondtion != null) {
    this.SelectedCondtion.className = cssname;
  }
  obj.className = cssname + " on";
  this.SelectedCondtion = obj;

  // 우측 내용 출력
  let item = this.getConditionItem(uid);

  let itemTempData = {};

  itemTempData.itemName = item.nsName;
  itemTempData.itemDesc = item.nsDescription;
  itemTempData.uid = uid;
  itemTempData.factorURL = item.nsFactorURL;

  let source_info = $("#template-port-cond-pop-item").html(); let template_info = Handlebars.compile(source_info);
  let html = template_info(itemTempData);

  $("#ConditionDetail").html(html);
  $("#btnCondInsert").click(function () { Component.MPortUI.setPopupConditionText($("#btnCondInsert").attr("targetuid")) });

  this.setPopupConditionRight(uid);
  },

  // 우측 조건식 선택 기능
  setPopupConditionRight: function (uid) {
  // 라디오 버튼이 변경될 때 함수 선택창 제한
  $("#selectFunction1").prop("disabled", false);

  $('.radio-function').on('click', function () {
      // 라디오 클릭 이벤트 따로 부여
      if (!$(this).hasClass('checked')) {
          var thisName = $(this).attr('data-name');
          $('.radio-function[data-name=' + thisName + ']').removeClass('checked');
          $(this).addClass('checked');
      }

      if ($("#radioFunction1").hasClass('checked')) {
          $("#selectFunction1").prop("disabled", false);
          $("#selectFunction2").prop("disabled", true);
          Component.MPortUI.checkFunction1();
      } else {
          $("#selectFunction1").prop("disabled", true);
          $("#selectFunction2").prop("disabled", false);
          Component.MPortUI.checkFunction2();
      }

      Component.MPortUI.setPopupConditionPreview(uid);
    })

  },

  setPopupConditionText: function(uid) {
    let item = this.getConditionItem(uid);
    let val = "";
    val = $('#inputTargetFunction').val();

    if(val == "") {
      val = "{" + item.nsLoName + "}";
    }

    val = $('#ConditionLeft').val() + val;
    $('#ConditionLeft').val(val);
  },

  searchPopCondition: function(e) {
    if (this.NowNum == null) {
      this.NowNum = -1;
    }

    // 아래 방향키
    if ((event.keyCode == 40 || event.keyCode == 38) && this.SearchConditionList.length > 0) {
      var num = event.keyCode == 40 ? this.NowNum + 1 : this.NowNum - 1;

      if (num > this.SearchConditionList.length - 1) { num = 0; }
      if (num < 0) { num = this.SearchConditionList.length - 1; }
      this.NowNum = num;

      event.stopPropagation();
      this.searchPopConditionDownEvent(num);
  } else {
      this.setPopupCondition(this.ConditionType, $("#ConditionSearch").val());
      this.NowNum = -1;
  }
},

openPopConditionTree: function (mainnum, subnum, conditionlength) {
  let visible = $("#citem" + mainnum.toString() + subnum.toString() + "0").css("display");
  let folderimg = $("#csubimg" + mainnum.toString() + subnum.toString());
  if(visible == none) {
    visible = "";
    folderimg.attr("src", "/img/icn_folderOpen.png");
  } else{
    visible = "none";
    folderimg.attr("src", "/img/icn_folderClose.png");
  }

  for (var i = 0; i< conditionlength; i++) {
    $("#citem" + mainnum.toString() + subnum.toString() + i.toString()).css("display", visible);
  }
}

}
