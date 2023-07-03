"""
permission manager

permission - mananger, view edit, delete, create, export, import

"""


from service.database import DatabaseMgr
from model import Permission
from exception import ArgsException
import config


def createPermissionFrom(result) -> tuple[bool, bool, Permission]:
    is_admin = bool(result.get('is_admin'))
    is_project_manager = bool(result.get('is_project_manager'))
    is_worker = bool(result.get('is_worker'))
    is_validator = bool(result.get('is_validator'))
    is_viewable = bool(result.get('is_viewable'))
    is_createable = bool(result.get('is_createable'))
    is_deleteable = bool(result.get('is_deleteable'))
    is_importable = bool(result.get('is_importable'))
    is_exportable = bool(result.get('is_exportable'))
    is_editable = bool(result.get('is_editable'))
    
    return is_admin, is_project_manager, Permission(
        is_viewable=is_viewable,
        is_createable=is_createable,
        is_deleteable=is_deleteable,
        is_importable=is_importable,
        is_exportable=is_exportable,
        is_editable=is_editable
    )

def isAdmin(user_id) -> bool:
    sql = """
        SELECT u.user_id, IF(rg.role_id IS NULL, false, true ) as 'is_admin'
        FROM user u 
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Administrator'
        WHERE u.user_id = %s 
        """
    result = DatabaseMgr.selectOne(sql, (user_id) )
    if result is None:
        return False
    
    is_admin = bool(result.get('is_admin'))

    return is_admin

def isManager(user_id) -> bool:
    sql = """
        SELECT u.user_id, IF(rg.role_id IS NULL, false, true ) as 'is_admin'
        FROM user u 
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Project Manager'
        WHERE u.user_id = %s 
        """
    result = DatabaseMgr.selectOne(sql, (user_id) )
    if result is None:
        return False
    
    is_project_manager = bool(result.get('is_project_manager'))

    return is_project_manager
   
def get_permission_dataset(user_id, dataset_id) -> tuple[bool, Permission]:
                
    is_admin = isAdmin(user_id)

    permission = Permission.createEmpty()

    if is_admin :
        permission._is_viewable=True
        permission._is_editable=True
        permission._is_createable=True
        permission._is_deleteable=True
        permission._is_exportable=True
        permission._is_importable=True            
        
    # todo 
    permission._is_viewable=True
    
    return is_admin, permission

def get_permission_rawdata(user_id, dataset_id, rawdata_id) -> tuple[bool, Permission]:
                
    is_admin = isAdmin(user_id)

    permission = Permission.createEmpty()

    if is_admin :
        permission._is_viewable=True
        permission._is_editable=True
        permission._is_createable=True
        permission._is_deleteable=True
        permission._is_exportable=True
        permission._is_importable=True            
        
    # todo 
    permission._is_viewable=True
    
    return is_admin, permission

def get_permission_user(user_id, target_user_id) -> tuple[bool, Permission]:
        
    """_get_permission_user_

    Args:
        user_id (_type_): _description_
        target_user_id (_type_): _description_

    Returns:
        _Permission_: _description_
    """    
    
    sql = """
        SELECT u.user_id, IF(rg.role_id IS NULL, false, true ) as 'is_admin'
        FROM user u 
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Administrator'
        WHERE u.user_id = %s 
        """
    result = DatabaseMgr.selectOne(sql, (user_id) )
    if result is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    is_admin = bool(result.get('is_admin'))

    permission = Permission.createEmpty()

    if is_admin :
        permission._is_viewable=True
        permission._is_editable=True
        permission._is_createable=True
        permission._is_deleteable=True
        permission._is_exportable=True
        permission._is_importable=True            
        
    # todo 
    permission._is_viewable=True
    
    # my
    if user_id == target_user_id:
        permission._is_editable=True
        permission._is_deleteable=True
    
    return is_admin, permission
    
def get_permission_project(user_id, project_id) -> tuple[bool, bool, Permission]:
        
    if project_id is None:
        return 
        
    """_get_permission_project_

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _Permission_: _description_
    """    
    
    sql = """
        SELECT u.user_id, IF(rg.role_id IS NULL, false, true ) as 'is_admin', IF(p.project_id  IS NULL, false, true ) as 'is_project_manager'
        FROM user u 
        LEFT JOIN project p ON p.project_manager_id = u.user_id and p.project_id = %s
        LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
        LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Administrator'
        WHERE u.user_id = %s 
        """
    result = DatabaseMgr.selectOne(sql, (project_id, user_id) )
    if result is None:
        raise ArgsException(f"User({user_id}) is not exists.")
    
    is_admin = bool(result.get('is_admin'))
    is_project_manager = bool(result.get('is_project_manager'))

    permission = Permission.createEmpty()

    if is_admin :
        permission._is_viewable=True
        permission._is_editable=True
        permission._is_createable=True
        permission._is_deleteable=True
        permission._is_exportable=True
        permission._is_importable=True
        
    elif is_project_manager :
        permission._is_viewable=True
        permission._is_editable=True             
        permission._is_createable=True
        permission._is_deleteable=True
        permission._is_exportable=True
        permission._is_importable=True 
        
    # todo - member 
    permission._is_viewable=True
    
    return is_admin, is_project_manager, permission
    

def get_permission_task(user_id, project_id, task_id ) -> tuple[bool, bool, Permission]:
    """_get_permission_project_

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_
        task_id (_type_): _description_

    Returns:
        _Permission_: _description_
    """    
    query = """
            SELECT u.user_id, 
            IF(rg.role_id IS NULL, false, true ) as 'is_admin', 
            IF(p.project_id  IS NULL, false, true ) as 'is_project_manager',
            true as is_viewable,
            IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_createable,
            IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_deleteable,
            IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id , true, false) as is_exportable,
            IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id or (t.task_worker_id=u.user_id and t.task_status_step=1) or (t.task_validator_id=u.user_id and t.task_status_step=2) , true, false) as is_importable,
            IF(rg.role_id IS NOT NULL or p.project_manager_id=u.user_id or (t.task_worker_id=u.user_id and t.task_status_step=1) or (t.task_validator_id=u.user_id and t.task_status_step=2) , true, false) as is_editable
            FROM `user` u 
            LEFT JOIN roles_globals rg ON rg.user_id = u.user_id 
            LEFT JOIN roles r ON r.role_id = rg.role_id and r.role_name = 'Administrator'
            LEFT JOIN project p ON p.project_manager_id = u.user_id and p.project_id = %s
            LEFT JOIN task t ON (( t.task_status_step = 1 and t.task_worker_id = u.user_id ) or ( t.task_status_step = 2 and t.task_validator_id  = u.user_id ) ) and t.project_id = %s and t.task_id = %s
            WHERE u.user_id = %s
            """
    result = DatabaseMgr.selectOne(query, (project_id, project_id, task_id, user_id) )
    if result is None:
        return False, False, Permission.createEmpty()
    
    return createPermissionFrom(result)
    

def check_permission_user_create(user_id) -> bool:
    """_ check permission create _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin = isAdmin(user_id)
    
    if is_admin :
        return True
         
    return False

def check_permission_user_edit(user_id, target_user_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        target_user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_user(user_id, target_user_id)
    
    if is_admin :
        return True
    
    return permission._is_editable

def check_permission_user_delete(user_id, target_user_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        target_user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_user(user_id, target_user_id)
    
    if is_admin :
        return True
    
    return permission._is_deleteable

def check_permission_user_view(user_id, target_user_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        target_user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_user(user_id, target_user_id)
    
    if is_admin :
        return True
    
    return permission._is_viewable

def check_permission_user_search(user_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return True


def check_permission_project_create(user_id) -> bool:
    """_ check permission create _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin = isAdmin(user_id)
    is_project_manager = isManager(user_id)
    
    if is_admin or is_project_manager:
        return True
         
    return False

def check_permission_project_edit(user_id, project_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    if is_admin :
        return True
    
    if is_project_manager or is_admin : 
        return True
    
    return permission._is_editable

def check_permission_project_delete(user_id, project_id) -> bool:
    """_ check permission delete _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_deleteable

def check_permission_project_view(user_id, project_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_viewable

def check_permission_project_search(user_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return True



def check_permission_task_create(user_id, project_id) -> bool:
    """_ check permission create _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return False

def check_permission_task_edit(user_id, project_id, task_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_
        task_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_task(user_id, project_id, task_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_editable

def check_permission_task_delete(user_id, project_id, task_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_
        task_id (_type_): _description_     

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_task(user_id, project_id, task_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_deleteable

def check_permission_task_view(user_id, project_id, task_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_
        task_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_task(user_id, project_id, task_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_viewable

def check_permission_task_search(user_id, project_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return True

def check_permission_task_export(user_id, project_id) -> bool:
    """_ check permission export _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_exportable

def check_permission_dataset_create(user_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return isAdmin(user_id)
    

def check_permission_dataset_edit(user_id, dataset_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_dataset(user_id, dataset_id)
    
    if is_admin:
        return True
    
    return permission._is_editable

def check_permission_dataset_delete(user_id, dataset_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_dataset(user_id, dataset_id)
    
    if is_admin:
        return True
    
    return permission._is_deleteable

def check_permission_dataset_view(user_id, dataset_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_dataset(user_id, dataset_id)
    
    if is_admin:
        return True
    
    return permission._is_viewable


def check_permission_dataset_search(user_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return True


def check_permission_rawdata_create(user_id, dataset_id) -> bool:
    """_ check permission create _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_dataset(user_id, dataset_id)
    
    if is_admin :
        return True
    
    return False

def check_permission_rawdata_edit(user_id, dataset_id, rawdata_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_
        rawdata_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_rawdata(user_id, dataset_id, rawdata_id)
    
    if is_admin :
        return True

    return permission._is_editable

def check_permission_rawdata_delete(user_id, dataset_id, rawdata_id) -> bool:
    """_ check permission edit _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_
        rawdata_id (_type_): _description_     

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_rawdata(user_id, dataset_id, rawdata_id)
    
    if is_admin :
        return True

    return permission._is_deleteable

def check_permission_rawdata_view(user_id, dataset_id, rawdata_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_
        rawdata_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    is_admin, permission = get_permission_rawdata(user_id, dataset_id, rawdata_id)
    
    if is_admin :
        return True
    
    return permission._is_viewable

def check_permission_rawdata_search(user_id, dataset_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        dataset_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    return True


def check_permission_statics_view(user_id, project_id) -> bool:
    """_ check permission view _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """
    
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_viewable


def check_permission_ai_autolableing(user_id, project_id, task_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_
        task_id (_type_): _description_

    Returns:
        _bool_: _description_
    """    
    
    is_admin, is_project_manager, permission = get_permission_task(user_id, project_id, task_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return permission._is_editable


def check_permission_ai_syncData(user_id, project_id) -> bool:
    """_ check permission _

    Args:
        user_id (_type_): _description_
        project_id (_type_): _description_

    Returns:
        _bool_: _description_
    """    
    
    is_admin, is_project_manager, permission = get_permission_project(user_id, project_id)
    
    if is_admin :
        return True
    
    if is_project_manager : 
        return True
    
    return False

