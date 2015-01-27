;(function(){

    function GithubClient(token){
        this.token = token;
        this.members = [];
        var self = this;

        var GithubRouter = Backbone.Router.extend({
            routes: {
                ":username": "drawUserInfo"
            },
            drawUserInfo: function(username){
                self.drawUser(username)
            },
            initialize: function(){
                Backbone.history.start();
            }
        })
        var router = new GithubRouter();

        this.draw();
    }

    GithubClient.prototype = {
        URLs: {
            members: "https://api.github.com/orgs/TIY-Houston-Front-End-Engineering/members"
        },
        access_token: function(){
            return "?access_token="+this.token
        },
        /**
         * getData
         * @arguments none.
         * @return promise
         */
        getData: function(){
            var x = $.Deferred();

            if(this.members.length > 0){
                x.resolve(this.members);
            } else {
                var p = $.get(this.URLs.members + this.access_token());
                p.then(function(data){
                    x.resolve(data);
                    this.members = data;
                })
            }

            return x;
        },

        loadTemplate: function(name){
            // modify the event context, return only the data
            return $.get("./templates/"+name+".html").then(function(data){ return data;})
        },

        draw: function(){
            $.when(
                this.getData(),
                this.loadTemplate("menu-item")
            ).then(function(members, html){
                var left_column = document.querySelector(".github-grid > *:nth-child(1)");
                left_column.innerHTML = _.template(html, { members: members });
            })
        },

        drawUser: function(username){
            alert(username)
        }
    }

    window.GithubClient = GithubClient;

})();
