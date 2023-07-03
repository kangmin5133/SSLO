
# version v0.2 to v0.3
insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.3', 'sslo_db', 'modify project_type', DATE('2022-11-03'), DATE('2022-11-03') ; 

# 프로젝트 유형 변경
UPDATE project_type set project_type_name='수집/정제', updated=DATE('2022-11-03')  WHERE project_type_id = 1;
UPDATE project_type set project_type_name='전처리', updated=DATE('2022-11-03') WHERE project_type_id = 2;
