const express = require('express');
const axios = require('axios')

const app = express();

const fs = require('fs') 

var my_token = ""

fs.readFile('Token.txt', (err, data) => { 
    if (err) throw err; 
    
    my_token = data.toString(); 
}) 

// set up endpoint that takes username
app.get('/:id', getMember)

// retrieves member data and formats into json and returns object
async function getMember(req, res)
{
    const member = req.params.id
    //retrieve member info page
    const member_info = await getMemberInfo(member)

    // if member exists, retrieve member repos and send formatted json object. If member doesn't exist, return an error
    if (member_info)
    {       
        const member_repos = await getMemberRepos(member)
        let repo_list = formatMemberRepos(member_repos)

        let json = formatMemberInfo(member_info, repo_list) 
        console.log(json)
        res.send(json)
    }
    else
    {
        console.error("Error: missing member info")
        res.send("Error: missing member info")
    }
    
}

// formats json object for member information
function formatMemberInfo(member_info, repo_list)
{
    let json = {
        user_name: member_info.data.login,
        display_name: member_info.data.name,
        avatar: member_info.data.avatar_url,
        geo_location: member_info.data.location,
        email: member_info.data.email,
        url: member_info.data.url,
        created_at: formatDate(member_info.data.created_at),
        repos: repo_list
    }
    return json
}

//formats list of repos for the member if it exists. List will be empty if it doesn't, but won't return any errors unless member is missing (see formatMemberInfo for related info)
function formatMemberRepos(member_repos)
{
    let repo_list = []
    if (member_repos)
    {
        for (i in member_repos.data)
        {
            let repo = member_repos.data[i]
            let new_repo = {
                name: repo.name,
                url: repo.html_url
            }
            repo_list.push(new_repo)
        }

    }
    return repo_list
}

// removes T and Z in date format
function formatDate(date)
{
    newdate = ""
    for (i in date)
    {
        if (date[i] == 'T')
        {
            newdate += " "
        }
        else if (date[i] == 'Z')
        {
            newdate += ''
        }
        else
        {
            newdate += date[i]
        }
    }
    return newdate
}

// retrieves member information
async function getMemberInfo(member)
{
    try
    {
        if (my_token)
        {
            return await axios.get(`https://api.github.com/users/${member}`, {
                'headers': {
                  'Authorization': `token ${my_token}` 
                }})
        }
        else{
            return await axios.get(`https://api.github.com/users/${member}`)
        }
    }
    catch (error)
    {
        console.error(error)
    }
}

// retrieves list of member repos
async function getMemberRepos(member)
{
    try
    {
        if(my_token)
        {
            return await axios.get(`https://api.github.com/users/${member}/repos`, {
                'headers': {
                  'Authorization': `token ${my_token}` 
                }})
        }
        else{
            return await axios.get(`https://api.github.com/users/${member}/repos`)
        }
        
    }
    catch (error)
    {
        console.error(error)
    }
}

const functions = {
    formatDate: formatDate,
    getMemberInfo: getMemberInfo,
    formatMemberRepos: formatMemberRepos
}

module.exports = functions;

// test Hello World
app.get('/', (req, res) => {
    res.send("Hello World!!!")
});

// set up port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

