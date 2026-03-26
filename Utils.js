export function Normalize(inVec)
{
    let x = inVec[0];
    let y = inVec[1];
    let z = inVec[2];
    let Magnitude = math.norm([x,y,z]);
    let normalizedVector = [x/Magnitude, y/Magnitude, z/Magnitude];
    return normalizedVector;
}

export function ToRadian(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function lerp( a, b, alpha )
{
  return a + alpha * (b - a);
}
export function Vec3ArrLerp(a, b, alpha)
{
  let x = lerp(a[0], b[0], alpha);
  let y = lerp(a[1], b[1], alpha);
  let z = lerp(a[2], b[2], alpha);
  let OutVec = [x, y, z];
  return OutVec;
}

