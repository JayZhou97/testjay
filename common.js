function disableTab(tabName, flag) {
    var sections = Xrm.Page.ui.tabs.get(tabName).sections.get();
    for (var j in sections) {
        var controls = sections[j].controls.get();
        for (var i in controls) {
            var control = controls[i];
            var controlType = control.getControlType();
            if (controlType != "iframe" && controlType != "webresource" && controlType != "subgrid") {
                if (control != null && control.getDisabled() == !flag) {
                    control.setDisabled(flag);
                }
            }
        }
    }
}

//检查当前用户角色
function CheckCurrentUserRole(roleName) {
    var hasRole = false;
    var filter = "Name eq '" + encodeURI(roleName) + "'";
    var roleList = CRK.RetrieveMultiple("Role", new Array("RoleId"), filter);
    var roles = Xrm.Page.context.getUserRoles();
    if (roleList.length > 0) {
        var nowRoleid = roleList[0].RoleId.replace("{", "").replace("}", "").toLowerCase();
        for (var i = 0; i < roles.length; i++) {
            var roleid = roles[i].replace("{", "").replace("}", "").toLowerCase();
            if (roleid == nowRoleid) {
                hasRole = true;
                break;
            }
        }
    }
    return hasRole;
}


function _setAllControlDisabled() {
    Xrm.Page.ui.controls.forEach(function (control, index) {
        if (control.getControlType() != "subgrid" && control.getControlType() != "iframe") {
            control.setDisabled(true);
        }
    });
}

//设置组织lookup值类型
function LookUpValue(client) {
    if (client && client.Id) {
        var lookup = [];
        lookup[0] = {};
        lookup[0].id = client.Id;
        lookup[0].entityType = client.LogicalName;
        lookup[0].name = client.Name;
        return lookup;
    } else {
        return null;
    }
}

//根据OwnerId获取当前的业务部门
function GetBUNameByOwnerId(ownerid) {
    var BuName;
    if (ownerid != null) {
        var usermodel = SDK.CrmData.RetrieveRecord(ownerid, "SystemUserSet", "");
        if (usermodel != null) {
            BuName = usermodel.tr_buname;
        }

    }
    return BuName;
}


//根据OwnerId获取当前的业务部门Id
function GetUnitIdByOwnerId(ownerid) {
    var BusinessUnit;
    if (ownerid != null) {
        var userEnt = CRK.Retrieve("SystemUser", ownerid, new Array("BusinessUnitId"), null);
        if (userEnt != null) {
            BusinessUnit = userEnt.BusinessUnitId;
        }
        return BusinessUnit;
    }
}
//根据userid获取用户最大用户保有量
function GetMaxAccNumberByOwnerId(userid) {
    var maxaccount;
    if (userid != null) {
        var userEnt = CRK.Retrieve("SystemUser", userid, new Array("new_maxaccount"), null);
        if (userEnt != null && userEnt.new_maxaccount != null) {
            maxaccount = userEnt.new_maxaccount;
        }

    }
    return maxaccount;
}



//根据业务部门ID获取审批角色配置
function IsRootUnitId(Unitid) {

    if (Unitid != null) {
        var filterstr = "?&$filter=businessunit/Id eq guid'" + Unitid + "' and knx_rootbu eq true";
        var buInfo = SDK.CrmData.RetrieveMultiple("businessunitSet", filterstr);
        if (buInfo != null && buInfo.results.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}



function GetApprovalInfoByUnitId(UnitId) {
    if (UnitId != null) {
        var orgInfo = GetApprovalTemplateByUnitId(UnitId);
        if (orgInfo != null) {
            return orgInfo;
        }
        else {
            var ParentUnitId = GetParentUnit(UnitId);
            var orgInfo = GetApprovalTemplateByUnitId(ParentUnitId);
            if (orgInfo != null) {
                return orgInfo;
            }
            else {
                return GetApprovalInfoByUnitId(ParentUnitId);
            }
        }
    }
    else {
        return null;
    }

}

function GetRootBusinessUnitId(UnitId) {
    if (UnitId != null) {
        var isRoot = IsRootUnitId(UnitId);
        if (isRoot != true) {
            return UnitId;
        }
        else {
            var ParentUnitId = GetParentUnit(UnitId);
            var isRoot = IsRootUnitId(ParentUnitId);
            if (isRoot != true) {
                return UnitId;
            }
            else {
                return GetRootBusinessUnitId(ParentUnitId);
            }
        }
    }
    else {
        return false;
    }

}
//查询上级业务部门
function GetParentUnit(UnitId) {
    var businessModal = SDK.CrmData.RetrieveRecord(UnitId, "BusinessUnitSet", "");
    if (businessModal != null) {
        return businessModal.ParentBusinessUnitId.Id;
    }
    else {
        return null;
    }
}
// 判断登录用户和表单负责人是否为同个BU线
function CompareBusinessUnit(LoginUserId, OwerId) {
    var LoginUserUnit = GetRootBusinessUnitId(LoginUserId);
    var OwerIdUnit = GetRootBusinessUnitId(OwerId);
    if (LoginUserId == OwerIdUnit) {
        return true;
    } else {
        return false;
    }

}

//根据用户Id获取所有业务线,第一个数组为用户所在业务部门的业务线
function getAllBuTypeByUserId(userid) {
    var butypes = new Array();
    var userEnt = CRK.Retrieve("SystemUser", userid,
       new Array("BusinessUnitId", "new_dept_1", "new_dept_2", "new_dept_3", "new_dept_4"), null);
    if (userEnt != null) {
        var businessunitid = userEnt.BusinessUnitId.Id;
        if (userEnt.new_dept_1 != 'undefined' && userEnt.new_dept_1 == true) {
            butypes.push("1");
        }
        if (userEnt.new_dept_2 != 'undefined' && userEnt.new_dept_2 == true) {
            butypes.push("2");
        }
        if (userEnt.new_dept_3 != 'undefined' && userEnt.new_dept_3 == true) {
            butypes.push("3");
        }
        if (userEnt.new_dept_4 != 'undefined' && userEnt.new_dept_4 == true) {
            butypes.push("4");
        }

        var buEnt = CRK.Retrieve("BusinessUnit", businessunitid, new Array("new_butype"), null);
        if (buEnt != null && buEnt.new_butype != null && buEnt.new_butype.Value != null) {
            {
                var bu = buEnt.new_butype.Value.toString();
                if ($.inArray(bu, butypes) == -1) {
                    butypes.unshift(bu);
                }

            }
        }
        else {
            butypes = [];

        }

        return butypes;

    }
}



function getWorkflowIdByName(entityname, workflowname) {
    var filter = "substringof('" + workflowname + "',Name) and PrimaryEntity eq '" + entityname + "' and Category/Value eq 0 and StateCode/Value eq 1";
    var workflowEnts = CRK.RetrieveMultiple("Workflow", new Array("WorkflowId"), filter);
    if (workflowEnts != null && workflowEnts.results != null && workflowEnts.results.length > 1) {

        var workflow = workflowEnts.results[1];
        if (workflow.WorkflowId != null) {
            return workflow.WorkflowId;
        }
    }
}
function getDialogIdByName(entityname, dialogname) {
    var filter = "substringof('" + dialogname + "',Name) and PrimaryEntity eq '" + entityname + "' and Category/Value eq 1 and StateCode/Value eq 1";
    var workflowEnts = CRK.RetrieveMultiple("Workflow", new Array("WorkflowId"), filter);
    if (workflowEnts != null && workflowEnts.results != null && workflowEnts.results.length > 1) {

        var workflow = workflowEnts.results[1];
        if (workflow.WorkflowId != null) {
            return workflow.WorkflowId;
        }

    }
}