<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-input v-model="role_name" placeholder="角色名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getroleList">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="showAddRole" v-if="permList.indexOf('role:add')!==-1"				>添加角色</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="roleList" border max-height="600px">
			<el-table-column fixed prop="id" label="序号"></el-table-column>
			<el-table-column prop="roleCode" label="角色编码"></el-table-column>
			<el-table-column prop="roleName" label="角色名"></el-table-column>
			<el-table-column prop="createBy" label="创建人"></el-table-column>
			<el-table-column prop="createTime" label="创建时间"></el-table-column>
			<el-table-column prop="operator" label="修改人"></el-table-column>
			<el-table-column prop="updateTime" label="修改时间"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="showUpdateRoleDialog(scope.row)" v-if="permList.indexOf('role:update')!=-1">修改</el-button>
					<el-button type="text" size="small" @click="deleteRole(scope.row.id)" v-if="scope.row.id>2 && permList.indexOf('role:delete')!==-1">删除 
					</el-button>
					<el-button type="text" size="small" @click="showAssignRoleDialog(scope.row.id)" v-if="permList.indexOf('role:perm')!=-1">分配权限</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页组件 -->
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageNumber" :page-sizes="[1,5, 10, 20, 30, 40]" :page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-dialog title="添加角色信息" :visible.sync="addRoleFormVisible">
			<el-form :model="addRole" :rules="rules" ref="formRef">
				<el-form-item label="角色编码" :label-width="formLabelWidth" prop="roleCode">
					<el-input v-model="addRole.roleCode" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
					<el-input v-model="addRole.roleName" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddRole">取 消</el-button>
				<el-button type="primary" @click="saveRole(),submitForm()" >确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改角色信息" :visible.sync="updateRoleFormVisible">
			<el-form :model="updateRole">
				<el-form-item label="ID" :label-width="formLabelWidth">
					<el-input v-model="updateRole.id" autocomplete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="角色编码" :label-width="formLabelWidth">
					<el-input v-model="updateRole.roleCode" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色名" :label-width="formLabelWidth">
					<el-input v-model="updateRole.roleName" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelUpdateRole">取 消</el-button>
				<el-button type="primary" @click="modifyRole">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="分配角色权限" :visible.sync="assignRoleFormVisible">
			<el-form>
				<el-form-item label="角色ID">
					<el-input v-model="roleId"></el-input>
				</el-form-item>
				<el-form-item>
                    <el-tree :data="rolePermTree" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkedPermList" :check-strictly="true"    :props="defaultProps">
                    </el-tree>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAssignPerm">取 消</el-button>
				<el-button type="primary" @click="assignPerm">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				roleList: [],
				permList:[],
				pageNumber: 1,
				pageSize: 5,
				total: 0,
				role_name: '',
				addRoleFormVisible: false,
				addRole: {},
				currentUserName:'',
				updateRoleFormVisible: false,
				updateRole: {},
				assignRoleFormVisible: false,
				formLabelWidth: "120px",
				rolePermTree: [],
				checkedPermList: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				roleId: null,
				rules: {
					roleCode: [  
						{ required: true, message: '角色编码不能为空', trigger: 'blur' }  
					],
					roleName: [  
						{ required: true, message: '角色名不能为空', trigger: 'blur' }  
					],
					createBy: [  
						{ required: true, message: '创建者不能为空', trigger: 'blur' }  
					],
				}
				
			}
		},
		methods: {
			getPermList() {
				this.$axios.get("/user/permList", {
						params: {
							"id": sessionStorage.getItem("userId")
						}
					})
					.then((res) => {
						this.permList = res.data.data;
						console.log(this.permList);
					})
					.catch(e => {
						console.log(e)
					});
			},
			getUserNameById() {
				let params = {
					userId: sessionStorage.getItem("userId")
				}

				//发送请求
				this.$axios.get('/user/info', {
						params: params
					})
					.then(res => {
						console.log(res);
						let data = res.data;
						if (data.code == 200) {
						this.currentUserName=data.data.username;
						}
					})
					.catch(err => {
						this.$message.error("请求失败");
						console.log(err);
					})
			},
			submitForm() {  
			this.$refs.formRef.validate((valid) => {  
				if (valid) {  
					console.log("表单验证成功!")
				} else {  
				console.log('表单验证失败!');  
				return false;  
				}  
			});  
			},  
			getroleList() {
				var params = {};
				params.pageNumber = this.pageNumber;
				params.pageSize = this.pageSize;

				if (this.role_name != '') {
					params.role_name = this.role_name;
				}
				this.$axios.get('/role/rolepage', {
						params: params
					})
					.then(result => {
						var data = result.data;
						this.roleList = data.data.rows;
						this.total = data.data.total;
					})
					.catch(e => {
						console.log(e);
					})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.getroleList();
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.pageNumber = val;
				this.getroleList();
			},
			cancelAddRole() {
				this.addRole = {};
				this.addRoleFormVisible = false;
			},
			saveRole() {
				this.addRole.createBy = this.currentUserName;
				this.$axios.post('/role/add', this.addRole)
					.then(res => {
						var data = res.data;
						if (data.code === 200) {
							this.$message.success(data.msg);
							this.addRoleFormVisible = false;
							this.getroleList();
						} else {
							this.$message.error(data.msg);
						}
					})
					.catch(e => {
						console.log(e)
					});
			},
			showAddRole() {
				this.addRoleFormVisible = true;
			},
			showUpdateRoleDialog(row) {
				this.updateRoleFormVisible = true;
				this.updateRole = row;
			},
			cancelUpdateRole() {
				this.updateRoleFormVisible = false;
				this.getroleList();
			},
			modifyRole() {
				this.updateRole.operator = this.currentUserName;
				this.$axios.post('/role/update', this.updateRole)
					.then(res => {
						var data = res.data;
						if (data.code === 200) {
							this.$message.success(data.msg);
							this.updateRoleFormVisible = false;
							this.getroleList();
						} else {
							this.$message.error(data.msg);
						}
					})
					.catch(e => {
						console.log(e)
					});
			},
			deleteRole(id) {
				this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {

					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'

				}).then(() => {
					this.$axios.get('/role/delete', {
							params: {
								"id": id
							}
						})
						.then(res => {
							var data = res.data;
							if (data.code === 200) {
								this.$message.success(data.msg);
								this.getroleList();
							} else {
								this.$message.error(data.msg);
							}
						})
						.catch(e => {
							console.log(e)
						});
				}).catch(() => {

					this.$message({
						type: 'info',
						message: '已取消删除'
					});

				});
			},
			showAssignRoleDialog(roleId) {
				this.getRolePermTree();
				this.getCheckedPermList(roleId);
				this.roleId = roleId;
				this.assignRoleFormVisible = true;
			},
			getRolePermTree() {
				this.$axios.get('/role/assign', {
						params: {
							"parentId": 0
						}
					})
					.then(result => {
						var data = result.data;
						this.rolePermTree = data.data;
					})
			},
			getCheckedPermList(roleId) {
				this.$axios.get('/rolePerm/permid', {
						params: {
							"roleId": roleId
						}
					})
					.then(result => {
						var data = result.data;
						this.checkedPermList = data.data;
					})

			},
			cancelAssignPerm() {
				this.assignRoleFormVisible = false;
				this.roleId=null;
			},
			assignPerm() {
				let params = {};
				params.permIdList = this.$refs.tree.getCheckedKeys();
				params.roleId = this.roleId;
				this.assignRoleFormVisible = false;
				console.log(params);
				this.$axios.post('/rolePerm/giveperm',params)
				.then(res => {
					var data = res.data;
					if (data.code === 200) {
						this.$message.success(data.msg);
						this.addRoleFormVisible = false;
					} else {
						this.$message.error(data.msg);
					}
				})
				.catch(e => {
					console.log(e)
				});
			}
		},
		mounted() {
			this.getroleList();
			this.getUserNameById();
			this.getPermList();
		}
	}
</script>
