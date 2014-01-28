window.blam = window.blam || {}
window.blam.calibrationResult = window.blam.calibrationResult || {}

window.blam.calibrationResult = (function() {
    
    /** Indicates if the result is defined or not. */
    this.isDefined;
    /** Set if the result is not defined. */
    this.errorMessage;
    /** The focal length in image plane coordinates.*/
    this.focalLengthImagePlaneCoords;
    /** The three vanishing points. */
    this.xVanishingPoint;
    this.yVanishingPoint;
    this.zVanishingPoint;
    /** The camera orientation as a 3x3 matrix. */
    this.orientationMatrix;
    /** The camera orientation as a unit quaternion. */
    this.orientationQuaternion;
    /** The camera orientation on axis angle form. */
    this.orientationAxisAngle;
    /** The camera 3D translation.*/
    this.translation;
    /** */
    this.modelViewMatrix;
    /** */
    this.projectionMatrix;
    /** */
    this.opticalCenter;
    /** */
    this.aspectRatio;
    
    reset = function() {
        this.isDefined = false;
        this.errorMessage = null;
        this.focalLengthImagePlaneCoords = 0;
        this.xVanishingPoint = [0.0, 0.0];
        this.yVanishingPoint = [0.0, 0.0];
        this.zVanishingPoint = [0.0, 0.0];
        this.orientationMatrix = window.blam.math.identityMatrix(3);
        console.log(this.orientationMatrix);
        this.orientationQuaternion = window.blam.math.zeroVector(4);
        this.orientationAxisAngle = window.blam.math.zeroVector(4);
        this.translation = window.blam.math.zeroVector(3);
        this.modelViewMatrix = window.blam.math.identityMatrix(4);
        this.projectionMatrix = window.blam.math.identityMatrix(4);
        this.principalPoint = window.blam.math.zeroVector(2);
        this.aspectRatio = 1.0;
    }
    
    this.compute = function(params) {
        reset();
        
        this.xVanishingPoint = blam.math.computeIntersectionPoint(params.xVanishingLine0, 
                                                                  params.xVanishingLine1);
                                                                  
        this.opticalCenter = [params.opticalCenter[0], params.opticalCenter[1]]; 
        
        
        if (params.numVanishingPoints == 1) {
            this.yVanishingPoint = blam.math.computeSecondVanishingPoint(this.xVanishingPoint,
                                                                         params.relativeFocalLength, 
                                                                         params.opticalCenter, 
                                                                         params.horizonDirection);

            this.focalLengthImagePlaneCoords = blam.math.computeFocalLength(this.xVanishingPoint,
                                                                            this.yVanishingPoint,
                                                                            params.opticalCenter);
            this.zVanishingPoint = blam.math.computeThirdVanishingPoint(this.xVanishingPoint,
                                                                        this.yVanishingPoint, 
                                                                        params.opticalCenter);
        }
        else if (params.numVanishingPoints == 2) {
            this.yVanishingPoint = blam.math.computeIntersectionPoint(params.yVanishingLine0, 
                                                                      params.yVanishingLine1);
                                                                      
            this.focalLengthImagePlaneCoords = blam.math.computeFocalLength(this.xVanishingPoint,
                                                                            this.yVanishingPoint,
                                                                            params.opticalCenter);
                                                                            
            this.zVanishingPoint = blam.math.computeThirdVanishingPoint(this.xVanishingPoint,
                                                                        this.yVanishingPoint, 
                                                                        params.opticalCenter);
            
        }
        else if (params.numVanishingPoints == 3) {
            this.yVanishingPoint = blam.math.computeIntersectionPoint(params.yVanishingLine0, 
                                                                      params.yVanishingLine1);
            this.zVanishingPoint = blam.math.computeIntersectionPoint(params.zVanishingLine0, 
                                                                      params.zVanishingLine1);                                                             
            var vpx = this.xVanishingPoint;
            var vpy = this.yVanishingPoint;
            var vpz = this.zVanishingPoint;
            this.opticalCenter = blam.math.computeTriangleOrthocenter([vpx, vpy, vpz]);
            
            this.focalLengthImagePlaneCoords = blam.math.computeFocalLength(this.xVanishingPoint,
                                                                            this.yVanishingPoint,
                                                                            this.opticalCenter);
        }
        
        //TODO: set properly
        this.isDefined = true;
        
    }
    
    return this;
}());