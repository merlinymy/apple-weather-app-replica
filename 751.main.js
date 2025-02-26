"use strict";(self.webpackChunkwebpack_template_theodinproject=self.webpackChunkwebpack_template_theodinproject||[]).push([[751],{341:(e,t,r)=>{r.d(t,{w:()=>a});var s=r(3513),i=r(4492),n=r(6563);const o={};function a(e,t){let r=2166136261;for(let s=0;s<t;s++)r^=e[s].uid,r=Math.imul(r,16777619),r>>>=0;return o[r]||function(e,t,r){const a={};let c=0;u||(u=(0,n.a)());for(let r=0;r<u;r++){const s=r<t?e[r]:i.g.EMPTY.source;a[c++]=s.source,a[c++]=s.style}const d=new s.T(a);return o[r]=d,d}(e,t,r)}let u=0},4751:(e,t,r)=>{r.d(t,{WebGPURenderer:()=>Se});var s=r(8507),i=r(9313),n=r(6563),o=r(341),a=r(5611),u=r(4459),c=r(4e3),d=r(2067),h=r(6665),l=r(8475),p=r(5811);class f{init(){const e=new p.k({uTransformMatrix:{value:new i.u,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),t=(0,a.v)({name:"graphics",bits:[u.F,(0,c._)((0,n.a)()),d._Q,h.b]});this.shader=new l.M({gpuProgram:t,resources:{localUniforms:e}})}execute(e,t){const r=t.context,s=r.customShader||this.shader,i=e.renderer,n=i.graphicsContext,{batcher:a,instructions:u}=n.getContextRenderData(r),c=i.encoder;c.setGeometry(a.geometry,s.gpuProgram);const d=i.globalUniforms.bindGroup;c.setBindGroup(0,d,s.gpuProgram);const h=i.renderPipes.uniformBatch.getUniformBindGroup(s.resources.localUniforms,!0);c.setBindGroup(2,h,s.gpuProgram);const l=u.instructions;let p=null;for(let t=0;t<u.instructionSize;t++){const r=l[t];if(r.topology!==p&&(p=r.topology,c.setPipelineFromGeometryProgramAndState(a.geometry,s.gpuProgram,e.state,r.topology)),s.groups[1]=r.bindGroup,!r.gpuBindGroup){const e=r.textures;r.bindGroup=(0,o.w)(e.textures,e.count),r.gpuBindGroup=i.bindGroup.getBindGroup(r.bindGroup,s.gpuProgram,1)}c.setBindGroup(1,r.bindGroup,s.gpuProgram),c.renderPassEncoder.drawIndexed(r.size,1,r.start)}}destroy(){this.shader.destroy(!0),this.shader=null}}f.extension={type:[s.Ag.WebGPUPipesAdaptor],name:"graphics"};var g=r(3391),m=r(4492),_=r(268);class b{init(){const e=(0,a.v)({name:"mesh",bits:[d.Ls,g.R,h.b]});this._shader=new l.M({gpuProgram:e,resources:{uTexture:m.g.EMPTY._source,uSampler:m.g.EMPTY._source.style,textureUniforms:{uTextureMatrix:{type:"mat3x3<f32>",value:new i.u}}}})}execute(e,t){const r=e.renderer;let s=t._shader;if(s){if(!s.gpuProgram)return void(0,_.R)("Mesh shader has no gpuProgram",t.shader)}else s=this._shader,s.groups[2]=r.texture.getTextureBindGroup(t.texture);const i=s.gpuProgram;if(i.autoAssignGlobalUniforms&&(s.groups[0]=r.globalUniforms.bindGroup),i.autoAssignLocalUniforms){const t=e.localUniforms;s.groups[1]=r.renderPipes.uniformBatch.getUniformBindGroup(t,!0)}r.encoder.draw({geometry:t._geometry,shader:s,state:t.state})}destroy(){this._shader.destroy(!0),this._shader=null}}b.extension={type:[s.Ag.WebGPUPipesAdaptor],name:"mesh"};var x=r(7547);const y=x.U.for2d();class G{start(e,t,r){const s=e.renderer,i=s.encoder,n=r.gpuProgram;this._shader=r,this._geometry=t,i.setGeometry(t,n),y.blendMode="normal",s.pipeline.getPipeline(t,n,y);const o=s.globalUniforms.bindGroup;i.resetBindGroup(1),i.setBindGroup(0,o,n)}execute(e,t){const r=this._shader.gpuProgram,s=e.renderer,i=s.encoder;if(!t.bindGroup){const e=t.textures;t.bindGroup=(0,o.w)(e.textures,e.count)}y.blendMode=t.blendMode;const n=s.bindGroup.getBindGroup(t.bindGroup,r,1),a=s.pipeline.getPipeline(this._geometry,r,y,t.topology);t.bindGroup._touch(s.textureGC.count),i.setPipeline(a),i.renderPassEncoder.setBindGroup(1,n),i.renderPassEncoder.drawIndexed(t.size,1,t.start)}}G.extension={type:[s.Ag.WebGPUPipesAdaptor],name:"batch"};var P=r(800),B=r(5008),v=r(5099);class S{constructor(e){this._hash=Object.create(null),this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_hash")}contextChange(e){this._gpu=e}getBindGroup(e,t,r){return e._updateKey(),this._hash[e._key]||this._createBindGroup(e,t,r)}_createBindGroup(e,t,r){const s=this._gpu.device,i=t.layout[r],n=[],o=this._renderer;for(const t in i){const r=e.resources[t]??e.resources[i[t]];let s;if("uniformGroup"===r._resourceType){const e=r;o.ubo.updateUniformGroup(e);const t=e.buffer;s={buffer:o.buffer.getGPUBuffer(t),offset:0,size:t.descriptor.size}}else if("buffer"===r._resourceType){const e=r;s={buffer:o.buffer.getGPUBuffer(e),offset:0,size:e.descriptor.size}}else if("bufferResource"===r._resourceType){const e=r;s={buffer:o.buffer.getGPUBuffer(e.buffer),offset:e.offset,size:e.size}}else if("textureSampler"===r._resourceType){const e=r;s=o.texture.getGpuSampler(e)}else if("textureSource"===r._resourceType){const e=r;s=o.texture.getGpuSource(e).createView({})}n.push({binding:i[t],resource:s})}const a=o.shader.getProgramData(t).bindGroups[r],u=s.createBindGroup({layout:a,entries:n});return this._hash[e._key]=u,u}destroy(){for(const e of Object.keys(this._hash))this._hash[e]=null;this._hash=null,this._renderer=null}}S.extension={type:[s.Ag.WebGPUSystem],name:"bindGroup"};var T=r(6736);class C{constructor(e){this._gpuBuffers=Object.create(null),this._managedBuffers=[],e.renderableGC.addManagedHash(this,"_gpuBuffers")}contextChange(e){this._gpu=e}getGPUBuffer(e){return this._gpuBuffers[e.uid]||this.createGPUBuffer(e)}updateBuffer(e){const t=this._gpuBuffers[e.uid]||this.createGPUBuffer(e),r=e.data;return e._updateID&&r&&(e._updateID=0,this._gpu.device.queue.writeBuffer(t,0,r.buffer,0,(e._updateSize||r.byteLength)+3&-4)),t}destroyAll(){for(const e in this._gpuBuffers)this._gpuBuffers[e].destroy();this._gpuBuffers={}}createGPUBuffer(e){this._gpuBuffers[e.uid]||(e.on("update",this.updateBuffer,this),e.on("change",this.onBufferChange,this),e.on("destroy",this.onBufferDestroy,this),this._managedBuffers.push(e));const t=this._gpu.device.createBuffer(e.descriptor);return e._updateID=0,e.data&&((0,T.W)(e.data.buffer,t.getMappedRange()),t.unmap()),this._gpuBuffers[e.uid]=t,t}onBufferChange(e){this._gpuBuffers[e.uid].destroy(),e._updateID=0,this._gpuBuffers[e.uid]=this.createGPUBuffer(e)}onBufferDestroy(e){this._managedBuffers.splice(this._managedBuffers.indexOf(e),1),this._destroyBuffer(e)}destroy(){this._managedBuffers.forEach((e=>this._destroyBuffer(e))),this._managedBuffers=null,this._gpuBuffers=null}_destroyBuffer(e){this._gpuBuffers[e.uid].destroy(),e.off("update",this.updateBuffer,this),e.off("change",this.onBufferChange,this),e.off("destroy",this.onBufferDestroy,this),this._gpuBuffers[e.uid]=null}}C.extension={type:[s.Ag.WebGPUSystem],name:"buffer"};class M{constructor(e){this._colorMaskCache=15,this._renderer=e}setMask(e){this._colorMaskCache!==e&&(this._colorMaskCache=e,this._renderer.pipeline.setColorMask(e))}destroy(){this._renderer=null,this._colorMaskCache=null}}M.extension={type:[s.Ag.WebGPUSystem],name:"colorMask"};var w=r(1761);class U{constructor(e){this._renderer=e}async init(e){return this._initPromise||(this._initPromise=this._createDeviceAndAdaptor(e).then((e=>{this.gpu=e,this._renderer.runners.contextChange.emit(this.gpu)}))),this._initPromise}contextChange(e){this._renderer.gpu=e}async _createDeviceAndAdaptor(e){const t=await w.e.get().getNavigator().gpu.requestAdapter({powerPreference:e.powerPreference,forceFallbackAdapter:e.forceFallbackAdapter}),r=["texture-compression-bc","texture-compression-astc","texture-compression-etc2"].filter((e=>t.features.has(e))),s=await t.requestDevice({requiredFeatures:r});return{adapter:t,device:s}}destroy(){this.gpu=null,this._renderer=null}}U.extension={type:[s.Ag.WebGPUSystem],name:"device"},U.defaultOptions={powerPreference:void 0,forceFallbackAdapter:!1};class A{constructor(e){this._boundBindGroup=Object.create(null),this._boundVertexBuffer=Object.create(null),this._renderer=e}renderStart(){this.commandFinished=new Promise((e=>{this._resolveCommandFinished=e})),this.commandEncoder=this._renderer.gpu.device.createCommandEncoder()}beginRenderPass(e){this.endRenderPass(),this._clearCache(),this.renderPassEncoder=this.commandEncoder.beginRenderPass(e.descriptor)}endRenderPass(){this.renderPassEncoder&&this.renderPassEncoder.end(),this.renderPassEncoder=null}setViewport(e){this.renderPassEncoder.setViewport(e.x,e.y,e.width,e.height,0,1)}setPipelineFromGeometryProgramAndState(e,t,r,s){const i=this._renderer.pipeline.getPipeline(e,t,r,s);this.setPipeline(i)}setPipeline(e){this._boundPipeline!==e&&(this._boundPipeline=e,this.renderPassEncoder.setPipeline(e))}_setVertexBuffer(e,t){this._boundVertexBuffer[e]!==t&&(this._boundVertexBuffer[e]=t,this.renderPassEncoder.setVertexBuffer(e,this._renderer.buffer.updateBuffer(t)))}_setIndexBuffer(e){if(this._boundIndexBuffer===e)return;this._boundIndexBuffer=e;const t=2===e.data.BYTES_PER_ELEMENT?"uint16":"uint32";this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(e),t)}resetBindGroup(e){this._boundBindGroup[e]=null}setBindGroup(e,t,r){if(this._boundBindGroup[e]===t)return;this._boundBindGroup[e]=t,t._touch(this._renderer.textureGC.count);const s=this._renderer.bindGroup.getBindGroup(t,r,e);this.renderPassEncoder.setBindGroup(e,s)}setGeometry(e,t){const r=this._renderer.pipeline.getBufferNamesToBind(e,t);for(const t in r)this._setVertexBuffer(t,e.attributes[r[t]].buffer);e.indexBuffer&&this._setIndexBuffer(e.indexBuffer)}_setShaderBindGroups(e,t){for(const r in e.groups){const s=e.groups[r];t||this._syncBindGroup(s),this.setBindGroup(r,s,e.gpuProgram)}}_syncBindGroup(e){for(const t in e.resources){const r=e.resources[t];r.isUniformGroup&&this._renderer.ubo.updateUniformGroup(r)}}draw(e){const{geometry:t,shader:r,state:s,topology:i,size:n,start:o,instanceCount:a,skipSync:u}=e;this.setPipelineFromGeometryProgramAndState(t,r.gpuProgram,s,i),this.setGeometry(t,r.gpuProgram),this._setShaderBindGroups(r,u),t.indexBuffer?this.renderPassEncoder.drawIndexed(n||t.indexBuffer.data.length,a??t.instanceCount,o||0):this.renderPassEncoder.draw(n||t.getSize(),a??t.instanceCount,o||0)}finishRenderPass(){this.renderPassEncoder&&(this.renderPassEncoder.end(),this.renderPassEncoder=null)}postrender(){this.finishRenderPass(),this._gpu.device.queue.submit([this.commandEncoder.finish()]),this._resolveCommandFinished(),this.commandEncoder=null}restoreRenderPass(){const e=this._renderer.renderTarget.adaptor.getDescriptor(this._renderer.renderTarget.renderTarget,!1,[0,0,0,1]);this.renderPassEncoder=this.commandEncoder.beginRenderPass(e);const t=this._boundPipeline,r={...this._boundVertexBuffer},s=this._boundIndexBuffer,i={...this._boundBindGroup};this._clearCache();const n=this._renderer.renderTarget.viewport;this.renderPassEncoder.setViewport(n.x,n.y,n.width,n.height,0,1),this.setPipeline(t);for(const e in r)this._setVertexBuffer(e,r[e]);for(const e in i)this.setBindGroup(e,i[e],null);this._setIndexBuffer(s)}_clearCache(){for(let e=0;e<16;e++)this._boundBindGroup[e]=null,this._boundVertexBuffer[e]=null;this._boundIndexBuffer=null,this._boundPipeline=null}destroy(){this._renderer=null,this._gpu=null,this._boundBindGroup=null,this._boundVertexBuffer=null,this._boundIndexBuffer=null,this._boundPipeline=null}contextChange(e){this._gpu=e}}A.extension={type:[s.Ag.WebGPUSystem],name:"encoder",priority:1};var E=r(1957);class R{constructor(e){this._renderTargetStencilState=Object.create(null),this._renderer=e,e.renderTarget.onRenderTargetChange.add(this)}onRenderTargetChange(e){let t=this._renderTargetStencilState[e.uid];t||(t=this._renderTargetStencilState[e.uid]={stencilMode:E.K.DISABLED,stencilReference:0}),this._activeRenderTarget=e,this.setStencilMode(t.stencilMode,t.stencilReference)}setStencilMode(e,t){const r=this._renderTargetStencilState[this._activeRenderTarget.uid];r.stencilMode=e,r.stencilReference=t;const s=this._renderer;s.pipeline.setStencilMode(e),s.encoder.renderPassEncoder.setStencilReference(t)}destroy(){this._renderer.renderTarget.onRenderTargetChange.remove(this),this._renderer=null,this._activeRenderTarget=null,this._renderTargetStencilState=null}}R.extension={type:[s.Ag.WebGPUSystem],name:"stencil"};var O=r(7047);const k={i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},f16:{align:2,size:2},"vec2<i32>":{align:8,size:8},"vec2<u32>":{align:8,size:8},"vec2<f32>":{align:8,size:8},"vec2<f16>":{align:4,size:4},"vec3<i32>":{align:16,size:12},"vec3<u32>":{align:16,size:12},"vec3<f32>":{align:16,size:12},"vec3<f16>":{align:8,size:6},"vec4<i32>":{align:16,size:16},"vec4<u32>":{align:16,size:16},"vec4<f32>":{align:16,size:16},"vec4<f16>":{align:8,size:8},"mat2x2<f32>":{align:8,size:16},"mat2x2<f16>":{align:4,size:8},"mat3x2<f32>":{align:8,size:24},"mat3x2<f16>":{align:4,size:12},"mat4x2<f32>":{align:8,size:32},"mat4x2<f16>":{align:4,size:16},"mat2x3<f32>":{align:16,size:32},"mat2x3<f16>":{align:8,size:16},"mat3x3<f32>":{align:16,size:48},"mat3x3<f16>":{align:8,size:24},"mat4x3<f32>":{align:16,size:64},"mat4x3<f16>":{align:8,size:32},"mat2x4<f32>":{align:16,size:32},"mat2x4<f16>":{align:8,size:16},"mat3x4<f32>":{align:16,size:48},"mat3x4<f16>":{align:8,size:24},"mat4x4<f32>":{align:16,size:64},"mat4x4<f16>":{align:8,size:32}};function H(e){const t=e.map((e=>({data:e,offset:0,size:0})));let r=0;for(let e=0;e<t.length;e++){const s=t[e];let i=k[s.data.type].size;const n=k[s.data.type].align;if(!k[s.data.type])throw new Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${s.data.type}`);s.data.size>1&&(i=Math.max(i,n)*s.data.size),r=Math.ceil(r/n)*n,s.size=i,s.offset=r,r+=i}return r=16*Math.ceil(r/16),{uboElements:t,size:r}}var z=r(6423),F=r(1266);function L(e,t){const{size:r,align:s}=k[e.data.type],i=(s-r)/4,n=e.data.type.indexOf("i32")>=0?"dataInt32":"data";return`\n         v = uv.${e.data.name};\n         ${0!==t?`offset += ${t};`:""}\n\n         arrayOffset = offset;\n\n         t = 0;\n\n         for(var i=0; i < ${e.data.size*(r/4)}; i++)\n         {\n             for(var j = 0; j < ${r/4}; j++)\n             {\n                 ${n}[arrayOffset++] = v[t++];\n             }\n             ${0!==i?`arrayOffset += ${i};`:""}\n         }\n     `}function D(e){return(0,z.E)(e,"uboWgsl",L,F._)}class W extends O.W{constructor(){super({createUboElements:H,generateUboSync:D})}}W.extension={type:[s.Ag.WebGPUSystem],name:"ubo"};var I=r(949),V=r(581),N=r(1132);class j{constructor({minUniformOffsetAlignment:e}){this._minUniformOffsetAlignment=256,this.byteIndex=0,this._minUniformOffsetAlignment=e,this.data=new Float32Array(65535)}clear(){this.byteIndex=0}addEmptyGroup(e){if(e>this._minUniformOffsetAlignment/4)throw new Error("UniformBufferBatch: array is too large: "+4*e);const t=this.byteIndex;let r=t+4*e;if(r=Math.ceil(r/this._minUniformOffsetAlignment)*this._minUniformOffsetAlignment,r>4*this.data.length)throw new Error("UniformBufferBatch: ubo batch got too big");return this.byteIndex=r,t}addGroup(e){const t=this.addEmptyGroup(e.length);for(let r=0;r<e.length;r++)this.data[t/4+r]=e[r];return t}destroy(){this.data=null}}var K=r(3513);const q=128;class Y{constructor(e){this._bindGroupHash=Object.create(null),this._buffers=[],this._bindGroups=[],this._bufferResources=[],this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_bindGroupHash"),this._batchBuffer=new j({minUniformOffsetAlignment:q});for(let e=0;e<2;e++){let t=N.S.UNIFORM|N.S.COPY_DST;0===e&&(t|=N.S.COPY_SRC),this._buffers.push(new I.h({data:this._batchBuffer.data,usage:t}))}}renderEnd(){this._uploadBindGroups(),this._resetBindGroups()}_resetBindGroups(){for(const e in this._bindGroupHash)this._bindGroupHash[e]=null;this._batchBuffer.clear()}getUniformBindGroup(e,t){if(!t&&this._bindGroupHash[e.uid])return this._bindGroupHash[e.uid];this._renderer.ubo.ensureUniformGroup(e);const r=e.buffer.data,s=this._batchBuffer.addEmptyGroup(r.length);return this._renderer.ubo.syncUniformGroup(e,this._batchBuffer.data,s/4),this._bindGroupHash[e.uid]=this._getBindGroup(s/q),this._bindGroupHash[e.uid]}getUboResource(e){this._renderer.ubo.updateUniformGroup(e);const t=e.buffer.data,r=this._batchBuffer.addGroup(t);return this._getBufferResource(r/q)}getArrayBindGroup(e){const t=this._batchBuffer.addGroup(e);return this._getBindGroup(t/q)}getArrayBufferResource(e){const t=this._batchBuffer.addGroup(e)/q;return this._getBufferResource(t)}_getBufferResource(e){if(!this._bufferResources[e]){const t=this._buffers[e%2];this._bufferResources[e]=new V.d({buffer:t,offset:256*(e/2|0),size:q})}return this._bufferResources[e]}_getBindGroup(e){if(!this._bindGroups[e]){const t=new K.T({0:this._getBufferResource(e)});this._bindGroups[e]=t}return this._bindGroups[e]}_uploadBindGroups(){const e=this._renderer.buffer,t=this._buffers[0];t.update(this._batchBuffer.byteIndex),e.updateBuffer(t);const r=this._renderer.gpu.device.createCommandEncoder();for(let s=1;s<this._buffers.length;s++){const i=this._buffers[s];r.copyBufferToBuffer(e.getGPUBuffer(t),q,e.getGPUBuffer(i),0,this._batchBuffer.byteIndex)}this._renderer.gpu.device.queue.submit([r.finish()])}destroy(){for(let e=0;e<this._bindGroups.length;e++)this._bindGroups[e].destroy();this._bindGroups=null,this._bindGroupHash=null;for(let e=0;e<this._buffers.length;e++)this._buffers[e].destroy();this._buffers=null;for(let e=0;e<this._bufferResources.length;e++)this._bufferResources[e].destroy();this._bufferResources=null,this._batchBuffer.destroy(),this._bindGroupHash=null,this._renderer=null}}Y.extension={type:[s.Ag.WebGPUPipes],name:"uniformBatch"};var $=r(7084),X=r(7952),Q=r(1172);const J={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4};class Z{constructor(e){this._moduleCache=Object.create(null),this._bufferLayoutsCache=Object.create(null),this._bindingNamesCache=Object.create(null),this._pipeCache=Object.create(null),this._pipeStateCaches=Object.create(null),this._colorMask=15,this._multisampleCount=1,this._renderer=e}contextChange(e){this._gpu=e,this.setStencilMode(E.K.DISABLED),this._updatePipeHash()}setMultisampleCount(e){this._multisampleCount!==e&&(this._multisampleCount=e,this._updatePipeHash())}setRenderTarget(e){this._multisampleCount=e.msaaSamples,this._depthStencilAttachment=e.descriptor.depthStencilAttachment?1:0,this._updatePipeHash()}setColorMask(e){this._colorMask!==e&&(this._colorMask=e,this._updatePipeHash())}setStencilMode(e){this._stencilMode!==e&&(this._stencilMode=e,this._stencilState=Q.g[e],this._updatePipeHash())}setPipeline(e,t,r,s){const i=this.getPipeline(e,t,r);s.setPipeline(i)}getPipeline(e,t,r,s){e._layoutKey||((0,$.q)(e,t.attributeData),this._generateBufferKey(e)),s||(s=e.topology);const i=function(e,t,r,s,i){return e<<24|t<<16|r<<10|s<<5|i}(e._layoutKey,t._layoutKey,r.data,r._blendModeId,J[s]);return this._pipeCache[i]||(this._pipeCache[i]=this._createPipeline(e,t,r,s)),this._pipeCache[i]}_createPipeline(e,t,r,s){const i=this._gpu.device,n=this._createVertexBufferLayouts(e,t),o=this._renderer.state.getColorTargets(r);o[0].writeMask=this._stencilMode===E.K.RENDERING_MASK_ADD?0:this._colorMask;const a=this._renderer.shader.getProgramData(t).pipeline,u={vertex:{module:this._getModule(t.vertex.source),entryPoint:t.vertex.entryPoint,buffers:n},fragment:{module:this._getModule(t.fragment.source),entryPoint:t.fragment.entryPoint,targets:o},primitive:{topology:s,cullMode:r.cullMode},layout:a,multisample:{count:this._multisampleCount},label:"PIXI Pipeline"};return this._depthStencilAttachment&&(u.depthStencil={...this._stencilState,format:"depth24plus-stencil8",depthWriteEnabled:r.depthTest,depthCompare:r.depthTest?"less":"always"}),i.createRenderPipeline(u)}_getModule(e){return this._moduleCache[e]||this._createModule(e)}_createModule(e){const t=this._gpu.device;return this._moduleCache[e]=t.createShaderModule({code:e}),this._moduleCache[e]}_generateBufferKey(e){const t=[];let r=0;const s=Object.keys(e.attributes).sort();for(let i=0;i<s.length;i++){const n=e.attributes[s[i]];t[r++]=n.offset,t[r++]=n.format,t[r++]=n.stride,t[r++]=n.instance}const i=t.join("|");return e._layoutKey=(0,X.X)(i,"geometry"),e._layoutKey}_generateAttributeLocationsKey(e){const t=[];let r=0;const s=Object.keys(e.attributeData).sort();for(let i=0;i<s.length;i++){const n=e.attributeData[s[i]];t[r++]=n.location}const i=t.join("|");return e._attributeLocationsKey=(0,X.X)(i,"programAttributes"),e._attributeLocationsKey}getBufferNamesToBind(e,t){const r=e._layoutKey<<16|t._attributeLocationsKey;if(this._bindingNamesCache[r])return this._bindingNamesCache[r];const s=this._createVertexBufferLayouts(e,t),i=Object.create(null),n=t.attributeData;for(let e=0;e<s.length;e++){const t=Object.values(s[e].attributes)[0].shaderLocation;for(const r in n)if(n[r].location===t){i[e]=r;break}}return this._bindingNamesCache[r]=i,i}_createVertexBufferLayouts(e,t){t._attributeLocationsKey||this._generateAttributeLocationsKey(t);const r=e._layoutKey<<16|t._attributeLocationsKey;if(this._bufferLayoutsCache[r])return this._bufferLayoutsCache[r];const s=[];return e.buffers.forEach((r=>{const i={arrayStride:0,stepMode:"vertex",attributes:[]},n=i.attributes;for(const s in t.attributeData){const o=e.attributes[s];1!==(o.divisor??1)&&(0,_.R)(`Attribute ${s} has an invalid divisor value of '${o.divisor}'. WebGPU only supports a divisor value of 1`),o.buffer===r&&(i.arrayStride=o.stride,i.stepMode=o.instance?"instance":"vertex",n.push({shaderLocation:t.attributeData[s].location,offset:o.offset,format:o.format}))}n.length&&s.push(i)})),this._bufferLayoutsCache[r]=s,s}_updatePipeHash(){const e=(t=this._stencilMode,r=this._multisampleCount,this._colorMask<<6|t<<3|this._depthStencilAttachment<<1|r);var t,r;this._pipeStateCaches[e]||(this._pipeStateCaches[e]=Object.create(null)),this._pipeCache=this._pipeStateCaches[e]}destroy(){this._renderer=null,this._bufferLayoutsCache=null}}Z.extension={type:[s.Ag.WebGPUSystem],name:"pipeline"};var ee=r(7238),te=r(1257),re=r(4884),se=r(583);class ie{constructor(){this.contexts=[],this.msaaTextures=[],this.msaaSamples=1}}class ne{init(e,t){this._renderer=e,this._renderTargetSystem=t}copyToTexture(e,t,r,s,i){const n=this._renderer,o=this._getGpuColorTexture(e),a=n.texture.getGpuSource(t.source);return n.encoder.commandEncoder.copyTextureToTexture({texture:o,origin:r},{texture:a,origin:i},s),t}startRenderPass(e,t=!0,r,s){const i=this._renderTargetSystem.getGpuRenderTarget(e),n=this.getDescriptor(e,t,r);i.descriptor=n,this._renderer.pipeline.setRenderTarget(i),this._renderer.encoder.beginRenderPass(i),this._renderer.encoder.setViewport(s)}finishRenderPass(){this._renderer.encoder.endRenderPass()}_getGpuColorTexture(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);return t.contexts[0]?t.contexts[0].getCurrentTexture():this._renderer.texture.getGpuSource(e.colorTextures[0].source)}getDescriptor(e,t,r){"boolean"==typeof t&&(t=t?te.u.ALL:te.u.NONE);const s=this._renderTargetSystem,i=s.getGpuRenderTarget(e),n=e.colorTextures.map(((e,n)=>{const o=i.contexts[n];let a,u;a=o?o.getCurrentTexture().createView():this._renderer.texture.getGpuSource(e).createView({mipLevelCount:1}),i.msaaTextures[n]&&(u=a,a=this._renderer.texture.getTextureView(i.msaaTextures[n]));const c=t&te.u.COLOR?"clear":"load";return r??(r=s.defaultClearColor),{view:a,resolveTarget:u,clearValue:r,storeOp:"store",loadOp:c}}));let o;if(!e.stencil&&!e.depth||e.depthStencilTexture||(e.ensureDepthStencilTexture(),e.depthStencilTexture.source.sampleCount=i.msaa?4:1),e.depthStencilTexture){const r=t&te.u.STENCIL?"clear":"load",s=t&te.u.DEPTH?"clear":"load";o={view:this._renderer.texture.getGpuSource(e.depthStencilTexture.source).createView(),stencilStoreOp:"store",stencilLoadOp:r,depthClearValue:1,depthLoadOp:s,depthStoreOp:"store"}}return{colorAttachments:n,depthStencilAttachment:o}}clear(e,t=!0,r,s){if(!t)return;const{gpu:i,encoder:n}=this._renderer,o=i.device;if(null===n.commandEncoder){const i=o.createCommandEncoder(),n=this.getDescriptor(e,t,r),a=i.beginRenderPass(n);a.setViewport(s.x,s.y,s.width,s.height,0,1),a.end();const u=i.finish();o.queue.submit([u])}else this.startRenderPass(e,t,r,s)}initGpuRenderTarget(e){e.isRoot=!0;const t=new ie;return e.colorTextures.forEach(((e,r)=>{if(re.q.test(e.resource)){const s=e.resource.getContext("webgpu"),i=e.transparent?"premultiplied":"opaque";try{s.configure({device:this._renderer.gpu.device,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC,format:"bgra8unorm",alphaMode:i})}catch(e){console.error(e)}t.contexts[r]=s}if(t.msaa=e.source.antialias,e.source.antialias){const e=new se.v({width:0,height:0,sampleCount:4});t.msaaTextures[r]=e}})),t.msaa&&(t.msaaSamples=4,e.depthStencilTexture&&(e.depthStencilTexture.source.sampleCount=4)),t}destroyGpuRenderTarget(e){e.contexts.forEach((e=>{e.unconfigure()})),e.msaaTextures.forEach((e=>{e.destroy()})),e.msaaTextures.length=0,e.contexts.length=0}ensureDepthStencilTexture(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);e.depthStencilTexture&&t.msaa&&(e.depthStencilTexture.source.sampleCount=4)}resizeGpuRenderTarget(e){const t=this._renderTargetSystem.getGpuRenderTarget(e);t.width=e.width,t.height=e.height,t.msaa&&e.colorTextures.forEach(((e,r)=>{const s=t.msaaTextures[r];s?.resize(e.source.width,e.source.height,e.source._resolution)}))}}class oe extends ee.l{constructor(e){super(e),this.adaptor=new ne,this.adaptor.init(e,this)}}oe.extension={type:[s.Ag.WebGPUSystem],name:"renderTarget"};class ae{constructor(){this._gpuProgramData=Object.create(null)}contextChange(e){this._gpu=e,this.maxTextures=e.device.limits.maxSampledTexturesPerShaderStage}getProgramData(e){return this._gpuProgramData[e._layoutKey]||this._createGPUProgramData(e)}_createGPUProgramData(e){const t=this._gpu.device,r=e.gpuLayout.map((e=>t.createBindGroupLayout({entries:e}))),s={bindGroupLayouts:r};return this._gpuProgramData[e._layoutKey]={bindGroups:r,pipeline:t.createPipelineLayout(s)},this._gpuProgramData[e._layoutKey]}destroy(){this._gpu=null,this._gpuProgramData=null}}ae.extension={type:[s.Ag.WebGPUSystem],name:"shader"};const ue={normal:{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},add:{alpha:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one",operation:"add"}},multiply:{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"dst",dstFactor:"one-minus-src-alpha",operation:"add"}},screen:{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src",operation:"add"}},overlay:{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"one",dstFactor:"one-minus-src",operation:"add"}},none:{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"zero",dstFactor:"zero",operation:"add"}},"normal-npm":{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"}},"add-npm":{alpha:{srcFactor:"one",dstFactor:"one",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one",operation:"add"}},"screen-npm":{alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"src-alpha",dstFactor:"one-minus-src",operation:"add"}},erase:{alpha:{srcFactor:"zero",dstFactor:"one-minus-src-alpha",operation:"add"},color:{srcFactor:"zero",dstFactor:"one-minus-src",operation:"add"}},min:{alpha:{srcFactor:"one",dstFactor:"one",operation:"min"},color:{srcFactor:"one",dstFactor:"one",operation:"min"}},max:{alpha:{srcFactor:"one",dstFactor:"one",operation:"max"},color:{srcFactor:"one",dstFactor:"one",operation:"max"}}};class ce{constructor(){this.defaultState=new x.U,this.defaultState.blend=!0}contextChange(e){this.gpu=e}getColorTargets(e){return[{format:"bgra8unorm",writeMask:0,blend:ue[e.blendMode]||ue.normal}]}destroy(){this.gpu=null}}ce.extension={type:[s.Ag.WebGPUSystem],name:"state"};var de=r(7608);const he={type:"image",upload(e,t,r){const s=e.resource,i=(0|e.pixelWidth)*(0|e.pixelHeight),n=s.byteLength/i;r.device.queue.writeTexture({texture:t},s,{offset:0,rowsPerImage:e.pixelHeight,bytesPerRow:e.pixelHeight*n},{width:e.pixelWidth,height:e.pixelHeight,depthOrArrayLayers:1})}},le={"bc1-rgba-unorm":{blockBytes:8,blockWidth:4,blockHeight:4},"bc2-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"bc3-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"bc7-rgba-unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"etc1-rgb-unorm":{blockBytes:8,blockWidth:4,blockHeight:4},"etc2-rgba8unorm":{blockBytes:16,blockWidth:4,blockHeight:4},"astc-4x4-unorm":{blockBytes:16,blockWidth:4,blockHeight:4}},pe={blockBytes:4,blockWidth:1,blockHeight:1},fe={type:"compressed",upload(e,t,r){let s=e.pixelWidth,i=e.pixelHeight;const n=le[e.format]||pe;for(let o=0;o<e.resource.length;o++){const a=e.resource[o],u=Math.ceil(s/n.blockWidth)*n.blockBytes;r.device.queue.writeTexture({texture:t,mipLevel:o},a,{offset:0,bytesPerRow:u},{width:Math.ceil(s/n.blockWidth)*n.blockWidth,height:Math.ceil(i/n.blockHeight)*n.blockHeight,depthOrArrayLayers:1}),s=Math.max(s>>1,1),i=Math.max(i>>1,1)}}},ge={type:"image",upload(e,t,r){const s=e.resource;if(!s)return;const i=Math.min(t.width,e.resourceWidth||e.pixelWidth),n=Math.min(t.height,e.resourceHeight||e.pixelHeight),o="premultiply-alpha-on-upload"===e.alphaMode;r.device.queue.copyExternalImageToTexture({source:s},{texture:t,premultipliedAlpha:o},{width:i,height:n})}},me={type:"video",upload(e,t,r){ge.upload(e,t,r)}};class _e{constructor(e){this.device=e,this.sampler=e.createSampler({minFilter:"linear"}),this.pipelines={}}_getMipmapPipeline(e){let t=this.pipelines[e];return t||(this.mipmapShaderModule||(this.mipmapShaderModule=this.device.createShaderModule({code:"\n                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(\n                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));\n\n                        struct VertexOutput {\n                        @builtin(position) position : vec4<f32>,\n                        @location(0) texCoord : vec2<f32>,\n                        };\n\n                        @vertex\n                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {\n                        var output : VertexOutput;\n                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);\n                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);\n                        return output;\n                        }\n\n                        @group(0) @binding(0) var imgSampler : sampler;\n                        @group(0) @binding(1) var img : texture_2d<f32>;\n\n                        @fragment\n                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {\n                        return textureSample(img, imgSampler, texCoord);\n                        }\n                    "})),t=this.device.createRenderPipeline({layout:"auto",vertex:{module:this.mipmapShaderModule,entryPoint:"vertexMain"},fragment:{module:this.mipmapShaderModule,entryPoint:"fragmentMain",targets:[{format:e}]}}),this.pipelines[e]=t),t}generateMipmap(e){const t=this._getMipmapPipeline(e.format);if("3d"===e.dimension||"1d"===e.dimension)throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");let r=e;const s=e.depthOrArrayLayers||1,i=e.usage&GPUTextureUsage.RENDER_ATTACHMENT;if(!i){const t={size:{width:Math.ceil(e.width/2),height:Math.ceil(e.height/2),depthOrArrayLayers:s},format:e.format,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC|GPUTextureUsage.RENDER_ATTACHMENT,mipLevelCount:e.mipLevelCount-1};r=this.device.createTexture(t)}const n=this.device.createCommandEncoder({}),o=t.getBindGroupLayout(0);for(let a=0;a<s;++a){let s=e.createView({baseMipLevel:0,mipLevelCount:1,dimension:"2d",baseArrayLayer:a,arrayLayerCount:1}),u=i?1:0;for(let i=1;i<e.mipLevelCount;++i){const e=r.createView({baseMipLevel:u++,mipLevelCount:1,dimension:"2d",baseArrayLayer:a,arrayLayerCount:1}),i=n.beginRenderPass({colorAttachments:[{view:e,storeOp:"store",loadOp:"clear",clearValue:{r:0,g:0,b:0,a:0}}]}),c=this.device.createBindGroup({layout:o,entries:[{binding:0,resource:this.sampler},{binding:1,resource:s}]});i.setPipeline(t),i.setBindGroup(0,c),i.draw(3,1,0,0),i.end(),s=e}}if(!i){const t={width:Math.ceil(e.width/2),height:Math.ceil(e.height/2),depthOrArrayLayers:s};for(let s=1;s<e.mipLevelCount;++s)n.copyTextureToTexture({texture:r,mipLevel:s-1},{texture:e,mipLevel:s},t),t.width=Math.ceil(t.width/2),t.height=Math.ceil(t.height/2)}return this.device.queue.submit([n.finish()]),i||r.destroy(),e}}class be{constructor(e){this.managedTextures=[],this._gpuSources=Object.create(null),this._gpuSamplers=Object.create(null),this._bindGroupHash=Object.create(null),this._textureViewHash=Object.create(null),this._uploads={image:ge,buffer:he,video:me,compressed:fe},this._renderer=e,e.renderableGC.addManagedHash(this,"_gpuSources"),e.renderableGC.addManagedHash(this,"_gpuSamplers"),e.renderableGC.addManagedHash(this,"_bindGroupHash"),e.renderableGC.addManagedHash(this,"_textureViewHash")}contextChange(e){this._gpu=e}initSource(e){if(e.autoGenerateMipmaps){const t=Math.max(e.pixelWidth,e.pixelHeight);e.mipLevelCount=Math.floor(Math.log2(t))+1}let t=GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST;"compressed"!==e.uploadMethodId&&(t|=GPUTextureUsage.RENDER_ATTACHMENT,t|=GPUTextureUsage.COPY_SRC);const r=le[e.format]||{blockBytes:4,blockWidth:1,blockHeight:1},s=Math.ceil(e.pixelWidth/r.blockWidth)*r.blockWidth,i=Math.ceil(e.pixelHeight/r.blockHeight)*r.blockHeight,n={label:e.label,size:{width:s,height:i},format:e.format,sampleCount:e.sampleCount,mipLevelCount:e.mipLevelCount,dimension:e.dimension,usage:t},o=this._gpu.device.createTexture(n);return this._gpuSources[e.uid]=o,this.managedTextures.includes(e)||(e.on("update",this.onSourceUpdate,this),e.on("resize",this.onSourceResize,this),e.on("destroy",this.onSourceDestroy,this),e.on("unload",this.onSourceUnload,this),e.on("updateMipmaps",this.onUpdateMipmaps,this),this.managedTextures.push(e)),this.onSourceUpdate(e),o}onSourceUpdate(e){const t=this.getGpuSource(e);t&&(this._uploads[e.uploadMethodId]&&this._uploads[e.uploadMethodId].upload(e,t,this._gpu),e.autoGenerateMipmaps&&e.mipLevelCount>1&&this.onUpdateMipmaps(e))}onSourceUnload(e){const t=this._gpuSources[e.uid];t&&(this._gpuSources[e.uid]=null,t.destroy())}onUpdateMipmaps(e){this._mipmapGenerator||(this._mipmapGenerator=new _e(this._gpu.device));const t=this.getGpuSource(e);this._mipmapGenerator.generateMipmap(t)}onSourceDestroy(e){e.off("update",this.onSourceUpdate,this),e.off("unload",this.onSourceUnload,this),e.off("destroy",this.onSourceDestroy,this),e.off("resize",this.onSourceResize,this),e.off("updateMipmaps",this.onUpdateMipmaps,this),this.managedTextures.splice(this.managedTextures.indexOf(e),1),this.onSourceUnload(e)}onSourceResize(e){const t=this._gpuSources[e.uid];t?t.width===e.pixelWidth&&t.height===e.pixelHeight||(this._textureViewHash[e.uid]=null,this._bindGroupHash[e.uid]=null,this.onSourceUnload(e),this.initSource(e)):this.initSource(e)}_initSampler(e){return this._gpuSamplers[e._resourceId]=this._gpu.device.createSampler(e),this._gpuSamplers[e._resourceId]}getGpuSampler(e){return this._gpuSamplers[e._resourceId]||this._initSampler(e)}getGpuSource(e){return this._gpuSources[e.uid]||this.initSource(e)}getTextureBindGroup(e){return this._bindGroupHash[e.uid]??this._createTextureBindGroup(e)}_createTextureBindGroup(e){const t=e.source;return this._bindGroupHash[e.uid]=new K.T({0:t,1:t.style,2:new p.k({uTextureMatrix:{type:"mat3x3<f32>",value:e.textureMatrix.mapCoord}})}),this._bindGroupHash[e.uid]}getTextureView(e){const t=e.source;return this._textureViewHash[t.uid]??this._createTextureView(t)}_createTextureView(e){return this._textureViewHash[e.uid]=this.getGpuSource(e).createView(),this._textureViewHash[e.uid]}generateCanvas(e){const t=this._renderer,r=t.gpu.device.createCommandEncoder(),s=w.e.get().createCanvas();s.width=e.source.pixelWidth,s.height=e.source.pixelHeight;const i=s.getContext("webgpu");return i.configure({device:t.gpu.device,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC,format:w.e.get().getNavigator().gpu.getPreferredCanvasFormat(),alphaMode:"premultiplied"}),r.copyTextureToTexture({texture:t.texture.getGpuSource(e.source),origin:{x:0,y:0}},{texture:i.getCurrentTexture()},{width:s.width,height:s.height}),t.gpu.device.queue.submit([r.finish()]),s}getPixels(e){const t=this.generateCanvas(e),r=de.N.getOptimalCanvasAndContext(t.width,t.height),s=r.context;s.drawImage(t,0,0);const{width:i,height:n}=t,o=s.getImageData(0,0,i,n),a=new Uint8ClampedArray(o.data.buffer);return de.N.returnCanvasAndContext(r),{pixels:a,width:i,height:n}}destroy(){this.managedTextures.slice().forEach((e=>this.onSourceDestroy(e))),this.managedTextures=null;for(const e of Object.keys(this._bindGroupHash)){const t=Number(e),r=this._bindGroupHash[t];r?.destroy(),this._bindGroupHash[t]=null}this._gpu=null,this._mipmapGenerator=null,this._gpuSources=null,this._bindGroupHash=null,this._textureViewHash=null,this._gpuSamplers=null}}be.extension={type:[s.Ag.WebGPUSystem],name:"texture"};const xe=[...B.i,W,A,U,C,be,oe,ae,ce,Z,M,R,S],ye=[...B.f,Y],Ge=[G,b,f],Pe=[],Be=[],ve=[];s.XO.handleByNamedList(s.Ag.WebGPUSystem,Pe),s.XO.handleByNamedList(s.Ag.WebGPUPipes,Be),s.XO.handleByNamedList(s.Ag.WebGPUPipesAdaptor,ve),s.XO.add(...xe,...ye,...Ge);class Se extends P.k{constructor(){super({name:"webgpu",type:v.W.WEBGPU,systems:Pe,renderPipes:Be,renderPipeAdaptors:ve})}}},7608:(e,t,r)=>{r.d(t,{N:()=>n});var s=r(1761),i=r(9939);const n=new class{constructor(e){this._canvasPool=Object.create(null),this.canvasOptions=e||{},this.enableFullScreen=!1}_createCanvasAndContext(e,t){const r=s.e.get().createCanvas();r.width=e,r.height=t;const i=r.getContext("2d");return{canvas:r,context:i}}getOptimalCanvasAndContext(e,t,r=1){e=Math.ceil(e*r-1e-6),t=Math.ceil(t*r-1e-6);const s=((e=(0,i.U5)(e))<<17)+((t=(0,i.U5)(t))<<1);this._canvasPool[s]||(this._canvasPool[s]=[]);let n=this._canvasPool[s].pop();return n||(n=this._createCanvasAndContext(e,t)),n}returnCanvasAndContext(e){const t=e.canvas,{width:r,height:s}=t,i=(r<<17)+(s<<1);e.context.clearRect(0,0,r,s),this._canvasPool[i].push(e)}clear(){this._canvasPool={}}}}}]);