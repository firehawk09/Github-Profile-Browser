;
(function() {

    function GithubClient(token) {
        this.token = token;
        this.members = [];
        this.repoData = [];
        var self = this;
        //    Allows for 'this' to access local scope

        var GithubRouter = Backbone.Router.extend({
            routes: {
                ":username": "drawUserInfo"
                    //recognizes ":username" and connects to "drawuserinfo"
            },
            drawUserInfo: function(username) {
                self.drawUser(username)
            },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new GithubRouter();
        console.log()
        this.draw();
        debugger;
    }

    GithubClient.prototype = {
        URLs: {
            members: "https://api.github.com/orgs/TIY-Houston-Front-End-Engineering/members",
        },

        access_token: function() {
            return "?access_token=" + this.token
        },

        /**
         * getData
         * @arguments none.
         * @return promise
         */

        getData: function() {
            var x = $.Deferred(),
                self = this;

            if (this.members.length > 0) {
                x.resolve(this.members);
            } else {
                var p = $.get(this.URLs.members + this.access_token());
                p.then(function(data) {
                    x.resolve(data);
                    self.members = data;
                })
            }

            return x;
        },


        loadTemplate: function(name) {
            // modify the event context, return only the data
            return $.get("./templates/" + name + ".html").then(function(data) {
                return data;
            })
        },

        draw: function() {
            $.when(
                this.getData(),
                this.loadTemplate("menu-item")
            ).then(function(members, html) {
                var left_column = document.querySelector(".github-grid > *:nth-child(1)");
                left_column.innerHTML = _.template(html, {
                    members: members
                });
            })
        },

        drawUser: function(username) {
            // When the username is called, draw all data associated with it
            $.when(
                this.getData(),
                this.loadTemplate("menu-item")
                //----> Place it on right side..
            )
            .then(function(repoData, repoTemplate){
                repoData.forEach(function(value) {
                    document.querySelector(".right").innerHTML += _.template(repoTemplate, value);
                })
            })
        }

    }
    window.GithubClient = GithubClient;

})();
