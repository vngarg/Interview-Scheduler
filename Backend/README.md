- [ ] Add a check for overlapping time in /newInterview API.
- [ ] If I don't change the participants & make a call to update Interview, then participant m s interview delete to ho gaya, but doobara add nhi hua.



- [ ] Add resume option. For that change the schema as well.
- [ ] While sending the response, make sure to add the point ki only super admin will have access to create a new admin, but we don't have super admin right now. So send them a userId & pwd for the admin to be used. Normal user they can create from the UI only.
- [ ] In the mail, mention that it is completely responsive (If tu responsive bana deta h to).
- [ ] Add this code is signup route so that admin signup is prohibited.

  if(role === 'admin') {
    return res.status(401).json({
      data: [],
      message: 'Unautorized'
    })
  }