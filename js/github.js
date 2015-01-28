;(function(){

    function GithubClient(token){
        this.token = token;
        this.members = [];
        this.repoData = [];
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
            members: "https://api.github.com/orgs/TIY-Houston-Front-End-Engineering/members",

            repoData: "https://api.github.com/users/"
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

        getMemberRepos: function(){
            var x = $.Deferred();

            if (this.repoData.length > 0) {
                x.resolve(this.repoData);
            } else {
                var p = $.get(this.URLs.repoData + this.members[0] + this.access_token());
                p.then(function(data){
                    x.resolve(data);
                    this.repoData = data;
                })
            }

            return x;
        },

        loadTemplate: function(name){
            // modify the event context, return only the data
            return $.get("./templates/"+name+".html").then(function(data){ return data;})
        },

        loadRepoTemplate: function(name) {
            // body...
            return $.get("./templates/"+name+".html").then(function(data){ return data;})
        },

        draw1: function(){
            $.when(
                this.getData(),
                this.loadTemplate("menu-item")
            ).then(function(members, html){
                var left_column = document.querySelector(".github-grid > *:nth-child(1)");
                left_column.innerHTML = _.template(html, { members: members });
            })
        },

        draw2: function(){
            $.when(
                this.getMemberRepos(),
                this.loadRepoTemplate("repo-item")
            ).then(function(repoData, html){
                var right_column = document.querySelector(".github-grid > *:nth-child(2)");
                right_column.innerHTML = _.template(html, { repoData: repoData });
            })
        },

        drawRepo: function()

        drawUser: function(username){
            alert(username)
        }
    }

    window.GithubClient = GithubClient;

})();
