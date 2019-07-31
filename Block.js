class Block{
  constructor(palette, cWeights, twoFab, x, y, dim, weights, rNum){
    this.rNum = rNum;
    this.univColor = palette
    this.twoFab = twoFab
    this.x = x
    this.y = y
    this.dimension = dim
    this.weights = weights
    this.hasGrad = true
    this.gradColor = [0, '#111411']
    this.gradColors = this.genGradient(
                        color(this.univColor[this.gradColor[0]]), 
                        color(this.gradColor[1]), 
                        10
                      )
    this.colors = this.setColors(palette, cWeights, this.gradColors, rNum, this.gradColor[0])
    this.cWeights = cWeights
  }

  drawBlock(x, y, dim){
    // block types
    const allowedBlocks = [ 
      () => this.drawSquare(this.x, this.y, this.dimension),
      () => this.drawVertical(this.x, this.y, this.dimension),
      () => this.drawHorizontal(this.x, this.y, this.dimension),
      () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
      () => this.drawDiagonalRight(this.x, this.y, this.dimension),
      () => this.drawBothDiagonal(this.x, this.y, this.dimension),
      () => this.drawBothStraight(this.x, this.y, this.dimension),
      () => this.recurseBlock(this.x, this.y, this.dimension)
    ]
    
    // random(allowedBlocks)()
    this.selectBlock(allowedBlocks)
  }

  /*-- UTIL FUNCTIONS --*/
  // determine random number from weights
  getRandomWeight(weights){
    let weightSum = 0;
    weights.forEach(weight => weightSum += weight)

    return parseInt(random(weightSum)) + 1;
  }

  getWeightedVal(weights, num){
    // selected index
    let check = -1;

    // current summed weight
    let numSum = 0;

    // iterate over array
    for (let i = 0; i < weights.length; i++){
      numSum = weights[i] + numSum;
      if (num - numSum <= 0){
        check = i
        i = weights.length
      }
    }
    return check;
  }

  genGradient(colorA, colorB, count){
    let gradColors = []
    gradColors.push(colorA)
    for (let i = 1; i < count-1; i++){
      gradColors.push(lerpColor(colorA, colorB, i/(count-1)))
    }
    gradColors.push(colorB)
    return gradColors;
  }

  // selected rendered block based on weight
  selectBlock(blocks){
    const block = this.getRandomWeight(this.weights[0])
    const check = this.getWeightedVal(this.weights[0], block)
    blocks[check]()
  }

  // determine block color pallete
  setColors(palette, weights, gradBuddy, rowNum, checkGrad){
    let checkA = this.getRandomWeight(weights)
    let indexA = this.getWeightedVal(weights, checkA)
    let colorA
    if (indexA === checkGrad  && this.hasGrad){
      colorA = gradBuddy[rowNum]
    } else {
      colorA = palette[indexA]
    }
    
    let newWeights = weights.slice()
    // allow blocks to contain two fabrics of the same color
    if (!this.twoFab) {      
      newWeights[indexA] = 0;
    }
    
    let checkB = this.getRandomWeight(newWeights)
    let indexB = this.getWeightedVal(newWeights, checkB)
    let colorB
    if (indexB === checkGrad && this.hasGrad){
      colorB = gradBuddy[rowNum]
    } else {
      colorB = palette[indexB]
    }
    if (colorA === colorB){
      console.log('boop')
      colorMode(HSB, 100)
      colorB = color(hue(colorA), saturation(colorA), brightness(colorA)-10)
    }
    
    return ([colorA, colorB])
  }

  // recursive block
  recurseBlock(x, y, dim){
    // let blocks = []
    const newDim = dim/2
    for (let i = 0; i < 2; i++){
      for (let j = 0; j < 2; j++){
        let block = new Block(
          this.univColor, 
          this.cWeights,
          this.twoFab,
          (i*newDim) + this.x, 
          (j*newDim) + this.y, 
          newDim, 
          this.weights.slice(1),
          this.rNum
        )
        block.drawBlock()
        // blocks.push(block)
      }
    }
  }

  // single block wit no subdivisions
  drawSquare(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim, dim)
  }

  // Single Straight Blocks
  drawVertical(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim/2, dim);
    fill(this.colors[1])
    rect(x+dim/2, y, dim/2, dim)
  }

  drawHorizontal(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim, dim/2);
    fill(this.colors[1])
    rect(x, y+dim/2, dim, dim/2)
  }

  // Single Diagonal Blocks
  drawDiagonalRight(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x+dim, y+dim)
    fill(this.colors[1])
    triangle(x, y, x, y+dim, x+dim, y+dim)
  }

  drawDiagonalLeft(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x, y+dim)
    fill(this.colors[1])
    triangle(x, y+dim, x+dim, y+dim, x+dim, y)
  }

  // Double Straight Block
  drawBothStraight(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim/2, dim/2);
    rect(x+dim/2, y+dim/2, dim/2, dim/2);
    fill(this.colors[1])
    rect(x+dim/2, y, dim/2, dim/2);
    rect(x, y+dim/2, dim/2, dim/2); 
  }

  // Double Diagonal Straight Block
  drawBothDiagonal(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x+(dim/2), y+(dim/2))   
    triangle(x, y+dim, x+dim/2, y+dim/2, x+dim, y+dim)
    fill(this.colors[1])
    triangle(x, y, x+dim/2, y+dim/2, x, y+dim)
    triangle(x+dim, y, x+dim/2, y+dim/2, x+dim, y+dim)
  }
}