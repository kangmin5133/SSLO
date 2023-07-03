
# version v0.1 to v0.2

# create system info
CREATE TABLE if not exists `system_info` (
  `version` varchar(32) NOT NULL,
  `name` varchar(100),
  `desc` varchar(512),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
);
insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.2', 'sslo_db', 'modify updated', DATE('2022-10-28'), DATE('2022-10-28') ; 

# updated 초기값을 현재시간으로 변경
UPDATE user set updated=created where updated is NULL;
ALTER TABLE user MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE user MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE comment set updated=created where updated is NULL;
ALTER TABLE comment MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE comment MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE project_type set updated=created where updated is NULL;
ALTER TABLE project_type MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE project_type MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE roles set updated=created where updated is NULL;
ALTER TABLE roles MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE roles MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE project set updated=created where updated is NULL;
ALTER TABLE project MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE project MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE project_detail set updated=created where updated is NULL;
ALTER TABLE project_detail MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE project_detail MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;



UPDATE annotation_type set updated=created where updated is NULL;
ALTER TABLE annotation_type MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE annotation_type MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE annotation_category set updated=created where updated is NULL;
ALTER TABLE annotation_category MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE annotation_category MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE user set updated=created where updated is NULL;
ALTER TABLE annotation_category_coco MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE annotation_category_coco MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE annotation_category_attribute set updated=created where updated is NULL;
ALTER TABLE annotation_category_attribute MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE annotation_category_attribute MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE license set updated=created where updated is NULL;
ALTER TABLE license MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE license MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE task set updated=created where updated is NULL;
ALTER TABLE task MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE task MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE task_type set updated=created where updated is NULL;
ALTER TABLE task_type MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE task_type MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE task_detail set updated=created where updated is NULL;
ALTER TABLE task_detail MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE task_detail MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE annotation set updated=created where updated is NULL;
ALTER TABLE annotation MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE annotation MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE dataset set updated=created where updated is NULL;
ALTER TABLE dataset MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE dataset MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;

UPDATE rawdata set updated=created where updated is NULL;
ALTER TABLE rawdata MODIFY COLUMN created datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;
ALTER TABLE rawdata MODIFY COLUMN updated datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL;