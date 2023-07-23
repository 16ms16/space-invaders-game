const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')    //to get methods for the 2D game.
const score=document.querySelector('#score')
console.log(score)
canvas.width= 1024
canvas.height=576

class Player{
    constructor(){
        this.velocity={
            x:0,
            y:0
        }
        this.rotation=0
        this.opacity=1
        const image=new Image()
        image.src='./img/spaceship.png'
        image.onload=()=>{
            const scale=0.15
            this.image=image
            this.width=image.width*scale
            this.height=image.height*scale
            this.position={
                x:canvas.width/2 - this.width/2,
                y:canvas.height-this.height-20
            }
        }
    }
    draw(){
        // c.fillStyle='red'
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)
        
        c.save()            //take ss of current moment in time
        c.globalAlpha=this.opacity
        c.translate(
            player.position.x+player.width/2,player.position.y+player.height/2
        )             //translating canvas to center of player
        c.rotate(this.rotation)
        c.translate(        //translating canvas to original position
            -player.position.x-player.width/2,
            -player.position.y-player.height/2
        )
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)

        c.restore()
    }
    update(){
        if(this.image){
            this.draw()
            this.position.x+=this.velocity.x
        }
    }
}

class Projectile{
    constructor({position,velocity}){
        this.position=position
        this.velocity=velocity
        this.radius=4
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)       //to create a circle
        c.fillStyle='red'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}
class Particle{
    constructor({position,velocity,radius,color,fades}){
        this.position=position
        this.velocity=velocity
        this.radius=radius
        this.color=color
        this.opacity=1
        this.fades=fades
    }
    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)       //to create a circle
        c.fillStyle=this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if(this.fades)
        this.opacity-=0.01
    }
}
class invaderProjectile{
    constructor({position,velocity}){
        this.position=position
        this.velocity=velocity
        this.width=3
        this.height=10
    }
    draw(){
        c.fillStyle='white'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}

class Invader{
    constructor({position}){      //passing a position object
        this.velocity={
            x:0,
            y:0
        }
        const image=new Image()
        image.src='./img/invader.png'
        image.onload=()=>{
            const scale=1
            this.image=image
            this.width=image.width*scale
            this.height=image.height*scale
            this.position={
                x:position.x,      //dynamic positioning
                y:position.y
            }
        }
    }
    draw(){
        // c.fillStyle='red'
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)
        
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
    update({velocity}){   //to make invaders move with velocity of grid passing an object
        if(this.image){
            this.draw()
            this.position.x+=velocity.x
            this.position.y+=velocity.y
        }
    }
    shoot(invaderProjectiles){
        invaderProjectiles.push(new invaderProjectile({
            position:{
                x:this.position.x+this.width/2,
                y:this.position.y+this.height
            },
            velocity:{
                x:0,
                y:5
            }
        }))
    }
}
class Grid{
    constructor(){
        this.position={
            x:0,
            y:0
        }
        this.velocity={
            x:5,
            y:0
        }
        this.invaders=[]

        const columns=Math.floor(Math.random()*10 + 5)         //random number of columns of invaders generated
        const rows=Math.floor(Math.random()*5 + 2)         //random number of rows of invaders generated
        this.width=columns*30
        for(let i=0;i<10;i++){      
            for(let j=0;j<rows;j++){
                this.invaders.push(
                    new Invader({
                        position:{
                            x:i*30,
                            y:j*30
                        }
                    }))
            }
        }
        // console.log(this.invaders)
    }
    update(){                //to move invaders
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.velocity.y=0      //reset velocity in next frame

        if(this.position.x+this.width>=canvas.width || this.position.x<=0){
            this.velocity.x=-this.velocity.x
            this.velocity.y=30
        }
    }
}

const player= new Player()
const projectiles=[]
const grids=[]
const invaderProjectiles=[]
const particles=[]

const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    space:{
        pressed:false
    },
}
let frames=0
let frameinterval=Math.floor(Math.random()*500+500)
let game={
    over:false,
    active:true
}
let scoreval=0

for(let i=0;i<100;i++){
    particles.push(new Particle({
        position:{
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height
        },
        velocity:{
            x:0,
            y:0.3
        },
        radius:Math.random()*2,
        color:"#ffff66"
    }))
}

function createPaticles({obj,color,fades}){                             //explosion effect
    for(let i=0;i<15;i++){
        particles.push(new Particle({
            position:{
                x:obj.position.x +obj.width/2,
                y:obj.position.y +obj.height/2
            },
            velocity:{
                x:(Math.random()-0.5)*2,
                y:(Math.random()-0.5)*2
            },
            radius:Math.random()*3,
            color:color,
            fades:true
        }))
    }
}

function animate(){             //to give image enough time to load.
    if(game.active==false) return
    requestAnimationFrame(animate)
    c.fillStyle='black'            //to avoid bugs later on related to fillStyle
    c.fillRect(0,0,canvas.width,canvas.height)

    player.update()
    particles.forEach((particle,index)=>{

        if(particle.position.y-particle.radius>=canvas.height){   //to create galaxy background effect
            particle.position.x= Math.random()*canvas.width
            particle.position.y= -particle.radius
        }

        if(particle.opacity<=0){           //remove particles
            setTimeout(()=>{
                particles.splice(index,1) 
            },0)
        }else{
        particle.update()}
    })
    invaderProjectiles.forEach((invaderProjectile,index)=>{
        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height){
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)  //removing projectiles when off the screen
            },0)
        }else invaderProjectile.update()

        //collision of player and invader projectile
        if(invaderProjectile.position.y+invaderProjectile.height>=player.position.y && invaderProjectile.position.x+invaderProjectile.width>=player.position.x && invaderProjectile.position.x<=player.position.x+player.width){
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)  //removing projectile which hits player
                player.opacity=0
                game.over=true
            },0)
            setTimeout(()=>{
                game.active=false
            },3000)
            createPaticles({
                obj:player,
                color:"white",
                fades:true
            })
        }
    })
    // console.log(invaderProjectiles)
    projectiles.forEach((projectile,index)=>{
        if(projectile.position.y+projectile.radius<=0){
            setTimeout(()=>{         //to ensure we get one added frame before splicing and avoid flashing
                projectiles.splice(index,1)
            },0)         //splice to save space and make game faster
        }else projectile.update()
    })
    grids.forEach((grid,gridindex)=>{
        grid.update()
        //spawning invader projectiles 
        if(frames%100===0 && grid.invaders.length>0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader,i)=>{
            invader.update({velocity: grid.velocity})

            //shooting invaders
            projectiles.forEach((projectile,j)=>{
                if(
                    projectile.position.y-projectile.radius<=invader.position.y+invader.height && projectile.position.x+projectile.radius>=invader.position.x && projectile.position.x-projectile.radius<=invader.position.x+invader.width && projectile.position.y+projectile.radius >=invader.position.y
                ){
                    setTimeout(()=>{      //setTimeout used to avoid flashing
                        const invaderfound=grid.invaders.find((invader2)=>invader2===invader)
                        const projectilefound=projectiles.find((projectile2)=>projectile2===projectile)
                        
                        //remove invader and projectiles
                        if(invaderfound && projectilefound){
                            scoreval+=10
                            score.innerHTML=scoreval
                            createPaticles({
                                obj:invader,
                                color:"lightblue",
                                fades:true
                            })
                            grid.invaders.splice(i,1)
                            projectiles.splice(j,1)
                            
                            //determining new grid width
                            if(grid.invaders.length>0){
                                const firstinvader=grid.invaders[0]
                                const lastinvader=grid.invaders[grid.invaders.length-1]
                                grid.width=lastinvader.position.x-firstinvader.position.x+lastinvader.width
                                grid.position.x=firstinvader.position.x
                            }else{
                                grids.splice(gridindex,1)     //clearing space
                            }
                        }
                    },0)
                }
            })

        })
    })

    if(keys.a.pressed && player.position.x>=0){
        player.velocity.x=-7
        player.rotation=-0.15
    }
    else if(keys.d.pressed && player.position.x + player.width<=canvas.width){
        player.velocity.x=7
        player.rotation=0.15
    }
    else{
        player.velocity.x=0
        player.rotation=0
    }
    //spawning invaders grid
    if(frames%frameinterval===0){
        grids.push(new Grid())
        frameinterval=Math.floor(Math.random()*500+500)
        frames=0           //to avoid 2 grids generated at same time
    }
    frames++
}
animate()

addEventListener('keydown',({key})=>{   //object destructuring, get property directly 
    if(game.over) return      
    switch(key){
        case 'a':
            console.log("left")
            keys.a.pressed=true
            break
        case 'd':
            console.log("right")
            keys.d.pressed=true
            break
        case ' ':
            console.log("space")
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x+player.width/2,
                    y:player.position.y
                },
                velocity:{
                    x:0,
                    y:-10
                }
            }))
            // console.log(projectiles)
            break
    }
})
addEventListener('keyup',({key})=>{   //object destructuring, get property directly
    switch(key){
        case 'a':
            console.log("left")
            keys.a.pressed=false
            break
        case 'd':
            console.log("right")
            keys.d.pressed=false
            break
        case ' ':
            console.log("space")
            break
    }
})