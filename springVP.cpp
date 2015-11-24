//float ksStr, ksShr, ksBnd, kdStr, kdShr, kdBnd;//uniforms

vec2 getNeighbor(int n, out float ks, out float kd)
{
	//structural springs (adjacent neighbors)
	if (n < 4){ ks = 0.1; kd = 0.1; }	//ksStr, kdStr
	if (n == 0)	return vec2(1.0, 0.0);
	if (n == 1)	return vec2(0.0, -1.0);
	if (n == 2)	return vec2(-1.0, 0.0);
	if (n == 3)	return vec2(0.0, 1.0);
	//shear springs (diagonal neighbors)
	if (n<8) {ks = 0.1;kd = 0.1;} //ksShr,kdShr
	if (n == 4) return vec2(1.0, -1.0);
	if (n == 5) return vec2(-1.0, -1.0);
	if (n == 6) return vec2(-1.0, 1.0);
	if (n == 7) return vec2(1.0, 1.0);
	//bend spring (adjacent neighbors 1 node away)
	if (n<12) { ks = ksBnd;kd = kdBnd;} //ksBnd,kdBnd
	if (n == 8)	return vec2(2.0, 0.0);
	if (n == 9) return vec2(0.0, -2.0);
	if (n == 10) return vec2(-2.0, 0.0);
	if (n == 11) return vec2(0.0, 2.0);
}

float ks, kd;

for (int k = 0; k < 12; k++)
{
	vec2 nCoord = getNeighbor(k, ks, kd);

	float inv_cloth_size = 1.0 / (100.0);//size of a single patch in world space
	float rest_length = length(nCoord*inv_cloth_size);

	float nxid = xid + nCoord.x;
	float nyid = yid + nCoord.y;
	if (nxid < 0.0 || nxid>99.0 || nyid<0.0 || nyid>99.0) continue;

	nCoord = vec2(nyid,nxid) / 100.0;
	vec3 posNP = texture2D(u_texPos, nCoord);
	vec3 prevNP = texture2D(u_texPrevPos, nCoord);

	vec3 v2 = (posNP - prevNP) / timestep;
	vec3 deltaP = pos.xyz - posNP;
	vec3 deltaV = vel - prevNP;
	float dist = length(deltaP);

	float   leftTerm = -ks * (dist - rest_length);
	float  rightTerm = kd * (dot(deltaV, deltaP) / dist);
	vec3 springForce = (leftTerm + rightTerm)* normalize(deltaP);
	F += springForce;
}





'//shear springs (diagonal neighbors)',
'if (n<8) { ks = 0.1; kd = 0.1; } //ksShr,kdShr',
'if (n == 4) return vec2(1.0, -1.0);',
'if (n == 5) return vec2(-1.0, -1.0);',
'if (n == 6) return vec2(-1.0, 1.0);',
'if (n == 7) return vec2(1.0, 1.0);',

//bend spring (adjacent neighbors 1 node away)
'if (n<12) { ks = ksBnd; kd = kdBnd; }', //ksBnd,kdBnd
'if (n == 8)	return vec2(2.0, 0.0);',
'if (n == 9) return vec2(0.0, -2.0);',
'if (n == 10) return vec2(-2.0, 0.0);',
'if (n == 11) return vec2(0.0, 2.0);',