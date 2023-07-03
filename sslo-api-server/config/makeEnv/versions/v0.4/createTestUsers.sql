# testdata - user
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'admin01', '$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G', 'admin01 user', 'admin@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'admin02', '$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm', 'admin02 user', 'admin02@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'admin03', '$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai', 'admin03 user', 'admin03@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'pm01', '$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G', '01 pm', 'pm.01@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'pm02', '$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm', '02 pm', 'pm.02@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'pm03', '$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai', '03 pm', 'pm.03@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'user01', '$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G', '02 user', 'user.01@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'user02', '$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm', '02 user', 'user.02@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'user03', '$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai', '03 user', 'user.03@tbell.co.kr';
insert into `user`(`user_id`, `user_password`, `user_display_name`, `user_email`) select 'user04', '$2b$12$k9PeYQEeV8GWRy4w1NNKT.SeoAT1JIM8TQUEk.rZn.xFQ6bVJQCEa', '04 user', 'user.04@tbell.co.kr';

# roles - globals
insert into `roles_globals` (`user_id`, `role_id` ) select 'admin01', 1;
insert into `roles_globals` (`user_id`, `role_id` ) select 'admin03', 1;




