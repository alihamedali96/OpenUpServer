const app = require("./app")
const request = require ('supertest'); 
const getAllPosts = require ("./app"); 


describe ('api server endpoints',()=>{
    let api;
    beforeAll(()=>{
        api = app.listen(3000,()=>{
                console.log("Test server running on port 5000")
        })
    })

    test('it responds to get / with status 200',(done)=>{
        request(api)
        .get('/')
        .expect(200,done);
    })

    test('it responds to get /homepage with status 200',(done)=>{
        request(api)
        .get(`/homepage/`)
        .expect(200,done);
    })

    
    test('it responds to get /allposts with status 200',(done)=>{
        request(api)
        .get('/allposts')
        .expect(200,done);
    })

    test('responds to get /myposts with status 200', (done) => { 
           request(api)
           .get('/mypage')      
           .expect(200,done);      
        })

        test('responds to post /myposts with status 201', (done) => { 
            request(api)
            .post('/mypage')      
            .expect(201,done);      
         }) 

         test('responds to delete /mypage with status 404', (done) => { 
            request(api)
            .delete('/mypage')      
            .expect(404,done);      
         }) 

         test('responds to get /search with status 200', (done) => { 
            request(api)
            .get('/search')      
            .expect(200,done);      
         }) 
         
         test('responds to patch /homepage with status 200', (done) => { 
            request(api)
            .patch('/homepage')      
            .expect(200,done);      
         }) 

         test('responds to patch /allposts with status 200', (done) => { 
            request(api)
            .patch('/allposts')      
            .expect(200,done);      
         }) 

        
         

    afterAll((done)=>{
        console.log('stop test server')
        api.close(done);
    })
})

 describe ('api functions',()=>{
            let api;
            beforeAll(()=>{
                api = app.listen(3000,()=>{
                        console.log("Test server running on port 5000")
                })
            })

            test('getAllPosts function should return allposts', () => { 
               
             
                expect(getAllPosts).toBeTruthy();
             }) 


            afterAll((done)=>{
                console.log('stop test server')
                api.close(done);
            })
            
        })

