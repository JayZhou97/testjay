function DisableFormFields(onOff) {
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        if (control.getName() != "") {
            control.setDisabled(true)
        }
    }
}

function SetDisabled(attrName) {
    Xrm.Page.ui.controls.get(attrName).setDisabled(true);

    Xrm.Page.data.entity.attributes.get(attrName).setSubmitMode("always");
}

function getDt() {
    var dt = new Date().getSeconds() + new Date().getMilliseconds();
    return dt;
}

//create
//        var obj = new Object();
//        obj.new_name = "create";
//        createRecord(obj, "odataSetName",
//        function (data, t, x) {
//            
//        },
//        null);
function createRecord(entityObject, odataSetName, successCallback, errorCallback, isasync) {

    if (!entityObject) {
        alert("entityObject is required.");
        return;
    }
    if (!odataSetName) {
        alert("odataSetName is required.");
        return;
    }
    if (isasync == null) {
        isasync = true;
    }
    var jsonEntity = window.JSON.stringify(entityObject);
    $.ajax({
        async: isasync,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName,
        data: jsonEntity,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {
            if (successCallback) {
                successCallback(data.d, textStatus, XmlHttpRequest);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            if (errorCallback)
                errorCallback(XmlHttpRequest, textStatus, errorThrown);
            else
                errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}

//delete
//deleteRecord(id, "odataSetName", null, null);
function deleteRecord(id, odataSetName, successCallback, errorCallback, isasync) {
    if (!id) {
        alert("record id is required.");
        return;
    }
    if (!odataSetName) {
        alert("odataSetName is required.");
        return;
    }
    if (isasync == null) {
        isasync = true;
    }
    $.ajax({
        async: isasync,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName + "(guid'" + id + "')",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
        },
        success: function (data, textStatus, XmlHttpRequest) {
            if (successCallback) {
                successCallback(data.d, textStatus, XmlHttpRequest);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            if (errorCallback)
                errorCallback(XmlHttpRequest, textStatus, errorThrown);
            else
                errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}

//update
//        var obj = new Object();
//        obj.new_name = "update";
//        updateRecord(id, obj, "odataSetName",
//        function (data, t, x) {
//            alert(json2str(data))
//        }, null);
function updateRecord(id, entityObject, odataSetName, successCallback, errorCallback, isasync) {

    if (!id) {
        alert("record id is required.");
        return;
    }
    if (!odataSetName) {
        alert("odataSetName is required.");
        return;
    }
    if (isasync == null) {
        isasync = true;
    }
    var jsonEntity = window.JSON.stringify(entityObject);
    $.ajax({
        async: isasync,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: jsonEntity,
        url: "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName + "(guid'" + id + "')",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
        },
        success: function (data, textStatus, XmlHttpRequest) {

            data = new Object();
            data.id = id;
            if (successCallback) {
                successCallback(data, textStatus, XmlHttpRequest);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            if (errorCallback)
                errorCallback(XmlHttpRequest, textStatus, errorThrown);
            else
                errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}
//retrieve
//        retrieveRecord(id, "odataSetName", function (data, textStatus, XmlHttpRequest) {
//            alert(data.new_name)
//        },
//    null);
function retrieveRecord(id, odataSetName, successCallback, errorCallback, isasync) {
    //debugger;
    if (!id) {
        alert("record id is required.");
        return;
    }

    if (!odataSetName) {
        alert("odataSetName is required.");
        return;
    }
    if (isasync == null) {
        isasync = true;
    }
    $.ajax({
        async: isasync,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName + "(guid'" + id + "')",
        beforeSend: function (XMLHttpRequest) {
            //Specifying this header ensures that the results will be returned as JSON.             
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {

            if (successCallback) {
                successCallback(data.d, textStatus, XmlHttpRequest);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {

            if (errorCallback)
                errorCallback(XmlHttpRequest, textStatus, errorThrown);
            else
                errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}

//retrieveMultiple 1:N or N:N 
//var filter = "?$select=new_name,new_test_account&$expand=new_test_account&$filter=new_name ne null ";
//retrieveMultiple("odataSetName", filter,
//        function (data, t, x) {
//            for (var i in data[0].new_test_account.results) {
//                alert(data[0].new_test_account.results[i].Address1_City)
//            }
//        }, null);
function retrieveMultiple(odataSetName, filter, successCallback, errorCallback, isasync) {
    if (!odataSetName) {
        alert("odataSetName is required.");
        return;
    }
    var odataUri = "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName + "()";
    if (filter) {
        odataUri += filter;
    }
    if (isasync == null) {
        isasync = true;
    }
    $.ajax({
        async: isasync,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: odataUri,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {

            if (successCallback) {
                if (data && data.d && data.d.results) {
                    successCallback(data.d.results, textStatus, XmlHttpRequest);
                }
                else if (data && data.d) {
                    successCallback(data.d, textStatus, XmlHttpRequest);
                }
                else {
                    successCallback(data, textStatus, XmlHttpRequest);
                }
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {

            errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}

//create associate 1:N or N:N
function associateRecord(entityid1, odataSetName1, entityid2, odataSetName2,
 relationship, successCallback, errorCallback) {
    // Id is required.
    if (!entityid1) {
        alert("record id 1 is required.");
        return;
    }

    if (!entityid2) {
        alert("record id 2 is required.");
        return;
    }

    // ODataSetName is required, i.e. "AccountSet"
    if (!odataSetName1) {
        alert("odataSetName 1 is required.");
        return;
    }

    if (!odataSetName2) {
        alert("odataSetName 2 is required.");
        return;
    }

    // Relationship is required, i.e. "opportunity_customer_accounts"
    if (!relationship) {
        alert("relationship is required.");
        return;
    }

    var entity2 = {};
    entity2.uri = "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName2 + "(guid'" + entityid2 + "')";
    var jsonEntity = window.JSON.stringify(entity2);

    performRequest({
        async: false,
        type: "POST",
        url: "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/OrganizationData.svc" + "/" + odataSetName1 + "(guid'" + entityid1 + "')/$links/" +
   relationship,
        data: jsonEntity,
        success: function (data, textStatus, XmlHttpRequest) {
            if (successCallback) {
                successCallback(data.d, textStatus, XmlHttpRequest);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            errorHandler(XmlHttpRequest, textStatus, errorThrown);
        }
    });
}

function performRequest(settings) {
    var request = new XMLHttpRequest();
    request.open(settings.type, settings.url, true);
    request.setRequestHeader("Accept", "application/json");
    if (settings.action != null) {
        request.setRequestHeader("X-HTTP-Method", settings.action);
    }
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    request.onreadystatechange = function () {
        if (this.readyState == 4 /*Complete*/) {
            // Status 201 is for create, status 204/1223 for link and delete.
            // There appears to be an issue where IE maps the 204 status to 1223
            // when no content is returned.
            if (this.status == 204 || this.status == 1223 || this.status == 201) {
                settings.success(this);
            }
            else {
                // Failure
                if (settings.error) {
                    settings.error(this);
                }
                else {
                    errorHandler(this);
                }
                //showMessage("performRequest function failure END");
            }
        }
    };

    if (typeof settings.data === "undefined") {
        request.send();
    }
    else {
        request.send(settings.data);
    }
}


//assign
//var userid = "DAB650CC-3E9B-E111-8202-000C29482CD3";
//var accountid = "EF479FC7-687D-E111-83EB-000C29482CD3";
//var result = "";
//var successCallback = function () { alert("success") };
//var errorCallback = function () { alert("error") };
//Assign(userid, accountid, "account", successCallback, errorCallback);
function Assign(Assignee, Target, Type, successCallback, errorCallback) {
    var url = "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/Organization.svc/web";
    var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
    request += "<s:Body>";
    request += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\"";
    request += " xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
    request += "<request i:type=\"b:AssignRequest\"";
    request += " xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"";
    request += " xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
    request += "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
    request += "<a:KeyValuePairOfstringanyType>";
    request += "<c:key>Target</c:key>";
    request += "<c:value i:type=\"a:EntityReference\">";
    request += "<a:Id>" + Target + "</a:Id>";
    request += "<a:LogicalName>" + Type + "</a:LogicalName>";
    request += "<a:Name i:nil=\"true\" />";
    request += "</c:value>";
    request += "</a:KeyValuePairOfstringanyType>";
    request += "<a:KeyValuePairOfstringanyType>";
    request += "<c:key>Assignee</c:key>";
    request += "<c:value i:type=\"a:EntityReference\">";
    request += "<a:Id>" + Assignee + "</a:Id>";
    request += "<a:LogicalName>systemuser</a:LogicalName>";
    request += "<a:Name i:nil=\"true\" />";
    request += "</c:value>";
    request += "</a:KeyValuePairOfstringanyType>";
    request += "</a:Parameters>";
    request += "<a:RequestId i:nil=\"true\" />";
    request += "<a:RequestName>Assign</a:RequestName>";
    request += "</request>";
    request += "</Execute>";
    request += "</s:Body>";
    request += "</s:Envelope>";

    var req = new XMLHttpRequest();
    req.open("POST", url, true)
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    req.onreadystatechange = function () { assignResponse(req, successCallback) };
    req.send(request);
}

function assignResponse(req, successCallback) {
    if (req.readyState == 4) {
        if (req.status == 200) {
            if (successCallback != null)
            { successCallback(); }
        }
        else {
            var errorMessage = "Unknown Error (Unable to parse the fault)";
            if (typeof req.responseXML == "object") {
                try {
                    var bodyNode = req.responseXML.firstChild.firstChild;
                    for (var i = 0; i < bodyNode.childNodes.length; i++) {
                        var node = bodyNode.childNodes[i];
                        if ("s:Fault" == node.nodeName) {
                            for (var j = 0; j < node.childNodes.length; j++) {
                                var faultStringNode = node.childNodes[j];
                                if ("faultstring" == faultStringNode.nodeName) {
                                    errorMessage = faultStringNode.text;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                catch (e) { };
            }
            alert(errorMessage)
            return new Error(errorMessage);

        }
    }
};

//getOptionsSetTextOnValue("new_sales_tasks", "new_selectobject", 100000001, function (res) {
//    alert(res);
//});
function getOptionsSetTextOnValue(entityLogicName, attributeLogicName, value, callBackFun) {
    getOptionsSetTextOnValueRequest(entityLogicName, attributeLogicName, function (req) {
        var bodyNode = req.responseXML.firstChild.firstChild;
        var optionsNodes = bodyNode.selectNodes("//c:OptionMetadata");
        for (var i = 0; i < optionsNodes.length; i++) {
            var options = optionsNodes[i].childNodes;
            for (var j = 0; j < options.length; j++) {
                if (options[j].nodeName == "c:Value") {
                    var optionValue = options[j].text;
                    if (parseInt(optionValue) == value) {
                        for (var m = 0; m < options.length; m++) {
                            if (options[m].nodeName == "c:Label") {
                                var labels = options[m].lastChild.childNodes;
                                for (var n = 0; n < labels.length; n++) {
                                    if (labels[n].nodeName == "a:Label") {
                                        res = labels[n].text;
                                        callBackFun(res);
                                        return res;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

function getOptionsSetTextOnValueRequest(entityLogicName, attributeLogicName, successCallback) {
    var url = "http://" + window.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/Organization.svc/web";
    var request = "<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>"
      + "<s:Body>"
         + "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>"
           + "<request i:type='a:RetrieveAttributeRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>"
             + "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>"
               + "<a:KeyValuePairOfstringanyType>"
                 + "<b:key>MetadataId</b:key>"
                 + "<b:value i:type='c:guid' xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/'>00000000-0000-0000-0000-000000000000</b:value>"
               + "</a:KeyValuePairOfstringanyType>"
               + "<a:KeyValuePairOfstringanyType>"
                 + "<b:key>RetrieveAsIfPublished</b:key>"
                 + "<b:value i:type='c:boolean' xmlns:c='http://www.w3.org/2001/XMLSchema'>true</b:value>"
               + "</a:KeyValuePairOfstringanyType>"
               + "<a:KeyValuePairOfstringanyType>"
                 + "<b:key>EntityLogicalName</b:key>"
                 + "<b:value i:type='c:string' xmlns:c='http://www.w3.org/2001/XMLSchema'>new_sales_tasks</b:value>"
               + "</a:KeyValuePairOfstringanyType>"
               + "<a:KeyValuePairOfstringanyType>"
                 + "<b:key>LogicalName</b:key>"
                 + "<b:value i:type='c:string' xmlns:c='http://www.w3.org/2001/XMLSchema'>new_selectobject</b:value>"
               + "</a:KeyValuePairOfstringanyType>"
             + "</a:Parameters>"
             + "<a:RequestId i:nil='true' />"
             + "<a:RequestName>RetrieveAttribute</a:RequestName>"
           + "</request>"
         + "</Execute>"
       + "</s:Body>"
     + "</s:Envelope>"

    var req = new XMLHttpRequest();
    req.open("POST", url, true)
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    req.onreadystatechange = function () { getOptionsSetTextOnValueResponse(req, successCallback) };
    req.send(request);
}


function getOptionsSetTextOnValueResponse(req, successCallback) {
    if (req.readyState == 4) {
        if (req.status == 200) {
            if (successCallback != null)
            { successCallback(req); }
        }
        else {
            var errorMessage = "Unknown Error (Unable to parse the fault)";
            if (typeof req.responseXML == "object") {
                try {
                    var bodyNode = req.responseXML.firstChild.firstChild;
                    for (var i = 0; i < bodyNode.childNodes.length; i++) {
                        var node = bodyNode.childNodes[i];
                        if ("s:Fault" == node.nodeName) {
                            for (var j = 0; j < node.childNodes.length; j++) {
                                var faultStringNode = node.childNodes[j];
                                if ("faultstring" == faultStringNode.nodeName) {
                                    errorMessage = faultStringNode.text;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                catch (e) { };
            }
            alert(errorMessage)
            return new Error(errorMessage);

        }
    }
};


function json2str(o) {
    var arr = [];
    var fmt = function (s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
    }
    for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
    return '{' + arr.join(',') + '}';
}

function errorHandler(xmlHttpRequest, textStatus, errorThrow) {
    alert("Error : " + textStatus + ": " + xmlHttpRequest.statusText);
}

//打开记录
function openRecord(entityName, id) {
    Xrm.Utility.openEntityForm(entityName, id, null);
}

function loadXML(xmlFile) {
    var xmlDoc;
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(xmlFile);
    }
    else if (document.implementation && document.implementation.createDocument) {
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(xmlFile);
    } else {
        alert('Your   browser   cannot   handle   this   script');
    }
    return xmlDoc;
}

//判断属性值是否变化
function getDirtyControls() {
    var res = "";
    var controls = Xrm.Page.data.entity.attributes.get();
    for (var i in controls) {
        if (controls[i].getIsDirty() == true) {
            res += controls[i].getName() + ",";
        }
    }
    alert(res);
}

//设置table键为横向移动
function ReArangeTabIndex() {
    for (var i = 0; i < crmForm.all.length; i++) {
        var element = crmForm.all[i];
        if (element.tabIndex) {
            if (element.className == "ms-crm-Hidden-NoBehavior" || element.tagName == "A") {
                continue;
            }
            element.tabIndex = 1000 + (i * 10);
        }
    }
}

function roundFun(numberRound, roundDigit) {
    var digit;
    digit = 1;
    digit = Math.pow(10, roundDigit)
    return (Math.round(numberRound * digit) / digit);
}

function DoReFresh() {
    this.parent.window.location.reload();
}

//不允许手动创建
function CanNotCreateForm() {
    if (Xrm.Page.ui.getFormType() == 1) {
        alert("不允许手动创建！");
        this.parent.window.close();
    }
}

//生成Excel模板
function PrintTemp(entityGuid, entityName) {
    var iHeight = "60";
    var iWidth = "200";
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open("/ISV/GenerateExcels/GenerateExcel.aspx?guid=" + entityGuid + "&&entityName=" + entityName + "", "CreateExcel", "height=" + iHeight + ",width=" + iWidth + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no", null);
}

// 加载XML文件并返回XML文档节点
function loadXmlFile(xmlFile) {
    var xmlDom = null;
    if (window.ActiveXObject) {
        xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.async = "false";
        //xmlDom.loadXML(xmlFile);//如果用的是XML字符串
        xmlDom.load(xmlFile); //如果用的是xml文件。
    } else if (document.implementation && document.implementation.createDocument) {
        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET", xmlFile, false);
        xmlhttp.send(null);
        xmlDom = xmlhttp.responseXML;
    } else {
        xmlDom = null;
    }
    return xmlDom;
}