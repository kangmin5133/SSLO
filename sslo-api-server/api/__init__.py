"""
select * from roles;
->
+---------+---------------+-----------+---------------------+---------------------+
| role_id | role_name     | role_desc | created             | updated             |
+---------+---------------+-----------+---------------------+---------------------+
|       1 | Administrator | NULL      | 2023-02-14 15:41:40 | 2023-02-14 15:41:40 |
|       2 | Project Manager | NULL      | 2023-02-14 15:41:40 | 2023-02-14 15:41:40 |
|       3 | Member        | NULL      | 2023-02-14 15:41:40 | 2023-02-14 15:41:40 |
+---------+---------------+-----------+---------------------+---------------------+
"""

def is_admin() -> bool:
    """_permission check - admin_

    Returns:
        bool: _True : admin_
    """
    return True

def is_project_manager(project_id) -> bool:
    """_permission check - project manager

    Returns:
        bool: _True : project manager_
    """
    return True

def is_project_member(project_id) -> bool:
    """_permission check - project member

    Returns:
        bool: _True : project member_
    """
    return True