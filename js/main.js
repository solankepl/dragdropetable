var totalGrideIdArr = ["#inFocusList", "#notInFocusList", "#outOfFocusList"]; 
$(function() {
   initplanOfCare();   
});

function initplanOfCare() {  
    
    $.each(totalGrideIdArr, function( index, value ) {
        creatGridObj(value);         
    });
    
    $(".plan-of-care-container").on("click", ".not-in-focus-title", showHideGride);
   
   //new gaol popup script 
    $(".new-goal-btn, #newGoalPopup .close-popup, #newGoalPopup .btn-close").on("click", openNewGoalpopup);

    $( "#newGoalPopup").draggable({ handle: "#goalHeader", cursor: "move"});
 
   $(".popup-goal-table .gola-popup-dragable").draggable({
        helper: "clone",        
    });

     droppableGaolTr(totalGrideIdArr[0]);
     droppableGaolTr(totalGrideIdArr[1]);
    
    //new gaol  popup script end    
    $(".e1").select2();
   
     //finalize popup script 
    $(".plan-of-care-container").on("click", ".finalize-btn", openFinalizePlanPopup);
    
    $("#FinalizePlanPopup").on("click", ".cancel-btn, .close-popup", closeFinalizePlanPopup);
    
    $("#FinalizePlanPopup").on("click", ".next-btn, .prav-btn", shwoNextPravPopup);
    
    $('#accPatient').accordion({
        collapsible:true,
        heightStyle: "content",
        beforeActivate: custmAccordion
    });
    
    $("#accCareTeam").accordion({
        collapsible:true,
        heightStyle: "content",
        beforeActivate: custmAccordion
    });
}

function custmAccordion(event, ui) {	
	if (ui.newHeader[0]) {
		var currHeader  = ui.newHeader;
		var currContent = currHeader.next('.ui-accordion-content');	
	} else {
		var currHeader  = ui.oldHeader;
		var currContent = currHeader.next('.ui-accordion-content');
	}
	var isPanelSelected = currHeader.attr('aria-selected') == 'true';

		currHeader.toggleClass('ui-corner-all',isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top',!isPanelSelected).attr('aria-selected',((!isPanelSelected).toString()));
		currContent.toggleClass('accordion-content-active',!isPanelSelected) 
        
	if (isPanelSelected) { 
        currContent.slideUp(); 
    }  else { 
        currContent.slideDown(); 
    }
	return false; 
} 

function shwoNextPravPopup(){
    var slectedRadioVal = $('input[name=plan]:checked').val();
    
   if($(this).hasClass("next-btn")){
        $("#FinalizePlanPopup #finalizePlan").hide();
        $("#FinalizePlanPopup #generatePlan").show();
        $("#generatePlan .patient").show();
        $("#generatePlan .careteam").show();
       
       if(slectedRadioVal === "patient"){
            $("#generatePlan .careteam").hide();
       }else if(slectedRadioVal === "careteam"){
            $("#generatePlan .patient").hide();
       }
       
   }else{
        $("#FinalizePlanPopup #finalizePlan").show();
        $("#FinalizePlanPopup #generatePlan").hide();
   }
}

function closeFinalizePlanPopup(){
    $("#FinalizePlanPopup").hide();
}

function openFinalizePlanPopup(){
    $("#FinalizePlanPopup").show();
    $("#FinalizePlanPopup #finalizePlan").show();
    $("#FinalizePlanPopup #generatePlan").hide();
}

function droppableGaolTr(elem){   
     $(elem + " .grid-Component").droppable({
        accept: '.gola-popup-dragable',
        dropOnEmpty: false,
        drop: function(event, ui) {    
            var curGrid = "#" + $(this).find(".grideTable").attr("data-grideid");               
                $(this).find(".grideTable").append($(ui.draggable).find(".add-data").clone());               
                addEventSlider(curGrid);
                updatePriority(curGrid);
                //sortableEnable(curGrid);                 
        }
    });
}

function openNewGoalpopup(){
    $(".new-goal-popup").toggle();
}

function creatGridObj(elem){    
   sortableEnable(elem +" .grideTable");   
   setGridHight(elem);    
    // sort on button click
    $(elem +" th.priority").click(function() {
        var order = $(this).attr("data-sort");
        if(order === "ascending"){
            $(this).attr("data-sort", "descending");
            $(elem + "#order-img").attr("src","images/asc-icon.gif");
        }else{
            $(this).attr("data-sort", "ascending");
             $(elem + "#order-img").attr("src","images/desc-icon.gif");
        }
        sortUsingNestedText($(elem +' .grideTable'), elem +" .grideTable .sortRow", ".priority span", order);
    });    
    addEvent(elem);    
}

function addEvent(elem){
    $(elem).on("click", ".sortRow .arrow-icon", expandDiv);
    $(elem).on("click", ".sortRow .edit-btn", expandEditDiv);
    
    $(elem).on("click", ".showAllDetails", showAllDetails);
    $(elem).on("click", ".hideAllDetails", hideAllDetails);
    $(elem).on("click", ".edit-arrow", closeEditDiv);  
        
    $(elem).on("click", ".problems-btn-group ul li", selectProblemlist);
    $(elem).on("click", ".problems-btn-group ul li:first", diSelectProblemlist);
   
   //tool tip 
    $(elem).on("mouseenter", "td.open-actions",  function() {
        $(this).find(".open-action-tool-tip").show();     
    });
    
    $(elem).on("mouseleave", "td.open-actions",  function() {
        $(this).find(".open-action-tool-tip").hide();     
    });    
    
    $(elem).on("change", ".per-value", function () {
		var value = $(this).val();		
        var curSlider = $(this).parent();
		curSlider.find(".slider").slider("value", parseInt(value));
		upadteSliderStatus(curSlider);
	});    
    addEventSlider(elem);    
}


function selectProblemlist(){     
    var curGrid  = "#"+ $(this).parent().parent().parent().attr("id");   
    $(curGrid + " .sortRow:first").removeClass("sortRow").addClass("ui-state-disabled");
}

function diSelectProblemlist(){
    var curGrid  = "#" + $(this).parent().parent().parent().attr("id");
    $(curGrid + " .ui-state-disabled").removeClass("ui-state-disabled").addClass("sortRow");
}


function showHideGride(){   
    $(this).next().toggle(); 
}

function addEventSlider(elem){
    $(elem+ " .slider" ).slider({        
        slide: function( event, ui ) {
            var curSlider = $(this).parent();            
            curSlider.find(".per-value").val(ui.value);
            upadteSliderStatus(curSlider);
        },        
        create: function(event, ui){
            $(this).slider('value',$(this).parent().find(".per-value").val());
        }        
    });    
}

function upadteSliderStatus(elem){        
        var curUpdateTxtBox = elem.find(".update-states");
		var sliderVal = parseInt(elem.find(".per-value").val());		
		if(sliderVal <= 0){
			curUpdateTxtBox.html("Not Started");
		}else if(sliderVal > 1 && sliderVal <= 33){
			curUpdateTxtBox.html("Early Progress");
		}else if(sliderVal > 33 && sliderVal <= 66){
			curUpdateTxtBox.html("Progressing");
		}else if(sliderVal > 66 && sliderVal <= 99){
			curUpdateTxtBox.html("Advanced Progress");
		}else if(sliderVal >99){
			curUpdateTxtBox.html("Goal Met");
		}
}

function setGridHight(elem){
    var totalRow = $(elem + " .sortRow").length;
    var sortRowHeight = $(elem + " .sortRow").height();
    var setMinheight = (parseInt(totalRow)+1) * sortRowHeight;    
    $(elem +" .grid-Component").css("min-height", setMinheight+"px");
}

function updatePriority(elem){  
    console.log("update Grid");
    $.each(totalGrideIdArr, function( index, value ) {
        var prioritySeq = 0; 
        var totalTr = $(value +" .priority-txt").length;
        
        if(totalTr<=0){
            $(value +" .first-row").css("height","100px");   
        }else{
            $(value +" .first-row").css("height","4px");   
        }
        
       $(value +" .priority-txt").each(function(i, obj) {           
           prioritySeq = i+1;    
           $(obj).html(prioritySeq); 
        });
    });
}

//Description div open 
function expandDiv () {  
    //console.og(hasClass("ui-state-disabled")
    var curTr = $(this).closest("table");
    var disableCurGride = "#" + curTr.closest("tbody").attr("data-grideId"); 
        $(this).toggleClass("arrow-icon-down");
        curTr.find(".all-data-show").toggle();
        disableEnableGrid(disableCurGride);
}

//edit div open 
function expandEditDiv () {  
     var curTr = $(this).closest("table");
     var disableCurGride = "#" + curTr.closest("tbody").attr("data-grideId");  
     var selectFirstTr = curTr.find("tr:first-child")[0];
        curTr.find(".all-data-show").hide();
        curTr.find(".edit-data").show();           
        $(selectFirstTr).css("visibility", "hidden");    
        disableEnableGrid(disableCurGride);  
}

function closeEditDiv(){
    var curTr = $(this).closest(".sortRow");
    var disableCurGride = "#" + curTr.closest("tbody").attr("data-grideId");
    var selectFirstTr = curTr.find("tr:first-child")[0];
        curTr.find(".arrow-icon").removeClass("arrow-icon-down");
        curTr.find(".all-data-show").hide();
        curTr.find(".edit-data").hide();      
        $(selectFirstTr).css("visibility", "visible");
        disableEnableGrid(disableCurGride); 
}

function showAllDetails(){
    var curGride = $(this).parent().parent().parent(); 
    var disableCurGride = "#" + curGride.find('tbody').attr("data-grideId"); 
    var selectFirstTr = curGride.find(".sortRow, .ui-state-disabled");
        curGride.find(".all-data-show").show(); 
        curGride.find(".arrow-icon").addClass("arrow-icon-down"); 
        curGride.find(".edit-data").hide();
        selectFirstTr.find("tr:first").css("visibility", "visible");
        disableEnableGrid(disableCurGride);     
}

function hideAllDetails(){
    var curGride = $(this).parent().parent().parent(); 
    var disableCurGride = "#" + curGride.find('tbody').attr("data-grideId");   
    var selectFirstTr = curGride.find(".sortRow, .ui-state-disabled");
    
        curGride.find(".all-data-show").hide();       
        curGride.find(".arrow-icon").removeClass("arrow-icon-down");     
        curGride.find(".arrow-icon").removeClass("arrow-icon-down"); 
        curGride.find(".edit-data").hide(); 
        selectFirstTr.find("tr:first").css("visibility", "visible");
        disableEnableGrid(disableCurGride);
}

function disableEnableGrid(elem) { 
    var allDataShowOpen = $(elem + " .grid-Component .all-data-show"); 
    var editDataOpen = $(elem + " .grid-Component .edit-data");
    var dragableRow = false;
   
        allDataShowOpen.each(function(i, obj) {       
            if($(obj).css("display") !== "none"){ 
               dragableRow = true;
               return false; 
            }
        }); 
    
        editDataOpen.each(function(i, obj) {       
           if($(obj).css("display") !== "none"){                    
               dragableRow = true;
               return false; 
            }
        });
    
    if(dragableRow){
        sortableDisable(elem + " .grideTable");
    }else{          
        sortableEnable(elem + " .grideTable");
    } 
}

function sortableDisable(elem) {   
    $(elem).sortable("disable");   
    $(elem + " tr").css("cursor","default");
    return false;
}


function sortableEnable(elem) {   
    $(elem).sortable({
        connectWith: ".grideTable",
        dropOnEmpty: true,
        items: '> :not(.nodragorsort)',
        cancel: ".ui-state-disabled",
        helper: function(e, tr)
        {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index)
            {             
              $(this).width($originals.eq(index).width())
            });
            return $helper;
        },      
        stop: function(event, ui) {            
            updatePriority(elem);
        }
    })   
  
    $(elem).sortable( "option", "disabled", false );
    //$( "tr" ).attr("contentEditable","false");
    $(elem +" tr" ).css("cursor","move");   
    
   // var t  = $("th.goal").width();
    
    //$("td.goal span").css("width", t+"px");
    
    return false;
}

/* sort data */
function sortUsingNestedText(parent, childSelector, keySelector, order) {   
    var items = parent.children(childSelector).sort(function(a, b) {
    var vA = $(keySelector, a).text();
    var vB = $(keySelector, b).text();        
           
       if(order === "ascending" ) {
            return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
       }else{
           return (vA > vB) ? -1 : (vA < vB) ? 1 : 0;
       }
    });
    parent.append(items);
}




