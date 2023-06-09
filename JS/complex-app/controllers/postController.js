const Post = require("../models/Post")
const sendgrid = require("@sendgrid/mail")
sendgrid.setApiKey(process.env.SENDGRIDAPIKEY)

exports.viewCreateScreen = function(req, res) {
    res.render("create-post")
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then(function(newId) {
        sendgrid.send({
            to: "mikerad83@gmail.com",
            from: "mikerad83@gmail.com",
            subject: "Congrats on Creating a New Post!",
            text: "You did it! Great job of creating a post.",
            html: "You did a <strong>great</strong> job of creating a post."
        })
        req.flash("success", "New post successfully created.")
        req.session.save(() => res.redirect(`/post/${newId}`))
    }).catch(function(errors) {
        errors.forEach(error => req.flash("errors", error))
        req.session.save(() => res.redirect("/create-post"))
    })
}

exports.apiCreate = function(req, res) {
    let post = new Post(req.body, req.apiUser._id)
    post.create().then(function(newId) {
        res.json("Congrats.")
    }).catch(function(errors) {
        res.json(errors)
    })
}

exports.viewSingle = async function(req, res) {
    try {
        //console.log(req.params.id)
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        res.render("single-post-screen", {post: post, title: post.title})
    } catch {
        res.render("404")
    }
}

exports.viewEditScreen = async function(req, res) {
    try {
      let post = await Post.findSingleById(req.params.id, req.visitorId)
      if (post.isVisitorOwner) {
        res.render("edit-post", {post: post})
      } else {
        req.flash("errors", "You do not have permission to perform that action.")
        req.session.save(() => res.redirect("/"))
      }
    } catch {
      res.render("404")
    }
}

exports.edit = async function(req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update().then((status) => {
        // Post successfully updated
        // Or, user had permission but failed due to validation error
        if (status == "success") {
            // Post updated.
            req.flash("success", "Post sucessfully updated.")
            req.session.save(function() {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        } else {
            post.errors.forEach(function(error) {
                req.flash("errors", error)
            })
            req.session.save(function() {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }

    }).catch(() => {
        // Requested post id doesn't exist
        // Current visitor is not owner of requested post
        req.flash("errors", "You do not have permission to perform that action.")
        req.session.save(function() {
            res.redirect("/")
        })

    })
}

exports.delete = function(req, res) {
    Post.delete(req.params.id, req.visitorId).then(() => {
        req.flash("success", "Post successfully deleted.")
        req.session.save(() => {res.redirect(`/profile/${req.session.user.username}`)})
    }).catch(() => {
        req.flash("errors", "You do not have permission to perform that action.")
        req.session.save(() => {res.redirect("/")})
    })
}

exports.apiDelete = function(req, res) {
    Post.delete(req.params.id, req.apiUser._id).then(() => {
        res.json("Success")
    }).catch(() => {
        res.json("You do not have permission to perform that action.")
    })
}

exports.search = function(req, res) {
    Post.search(req.body.searchTerm).then(posts => {
        res.json(posts)
    }).catch(() => {
        res.json([])
    })
}