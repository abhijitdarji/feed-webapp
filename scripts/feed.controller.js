(function() {
  "use strict";

  var moduleID = "FeedApp";
  var ctrlID = "AppCtrl";

  angular.module(moduleID).controller(ctrlID, AppCtrl);

  AppCtrl.$inject = [
    "$sce",
    "FeedService",
    "$mdSidenav",
    "$timeout",
    "$mdDialog"
  ];

  function AppCtrl($sce, FeedService, $mdSidenav, $timeout, $mdDialog) {
    var vm = this;

    vm.msgLoading = "Loading...";
    vm.postsCount = 10;
    vm.selectedIndex = 0;
    vm.selectedItem = null;
    vm.mode = "list";

    vm.toggleLeft = buildToggler("left");
    vm.trustAsHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    FeedService.getSubs().success(function(data) {
      vm.tabs = data.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      });

      vm.loadData(vm.selectedIndex);
    });

    vm.loadData = function(tabIndex) {
      vm.selectedIndex = tabIndex;
      vm.selectedItem = null;
      if($mdSidenav("left").isOpen())vm.toggleLeft();

      if (vm.tabs[tabIndex].isLoaded) {
        return;
      }

      if (!navigator.onLine) {
        vm.msgLoading = "Please connect to the internet.";
        return;
      }

      var url = vm.tabs[tabIndex].xmlUrl;

      FeedService.fetchData(vm.postsCount, url)
        .success(function(data) {
          //$log.debug(data.responseData);
          var items = data.query.results.item;

          items.map(obj => {
            obj.snippet = obj.encoded
              ? obj.encoded.substring(0, 300).toString() + "..."
              : "...";
            return obj;
          });

          vm.tabs[tabIndex].content = items;
          vm.tabs[tabIndex].isLoaded = true;
        })
        .error(function(e) {
          vm.msgLoading = "Error loading the data. Please try again.";
        });
    }; //loaddata

    vm.showDialog = function(tabIndex, entryIndex) {
      $mdDialog.show({
        template:
          "<md-dialog>" +
          '  <md-toolbar class="md-warn">' +
          '       <div class="md-toolbar-tools">' +
          "           <h2>More...</h2>" +
          "           <span flex></span>" +
          '           <md-button class="md-icon-button" ng-click="dm.closeDialog()">' +
          "               <h2>X</h2>" +
          "           </md-button>" +
          "       </div>" +
          "  </md-toolbar>" +
          '  <md-dialog-content class="md-padding" ng-bind-html="dm.content">asdf</md-dialog-content>' +
          "  <md-dialog-actions>" +
          '    <md-button ng-click="dm.closeDialog()" class="md-primary">' +
          "      Close" +
          "    </md-button>" +
          "  </md-dialog-actions>" +
          "</md-dialog>",
        controller: [
          "$mdDialog",
          "content",
          function DialogCtrl($mdDialog, content) {
            var dm = this;
            dm.content = content;
            dm.closeDialog = function() {
              $mdDialog.hide();
            };
          }
        ],
        controllerAs: "dm",
        locals: {
          content: vm.trustAsHtml(vm.tabs[tabIndex].content[entryIndex].encoded)
        }
      });
    };
  }
})();
