-- This file has default data for testing purposes

-- Dummy User Data
-- Insert users and retrieve their IDs
DO $$ 
DECLARE
    userA_id INT;
    userB_id INT;
    thread1_userA_id INT;
    thread2_userA_id INT;
    thread1_userB_id INT;
    thread2_userB_id INT;
BEGIN
    -- Insert users and get their IDs
    INSERT INTO users (username) VALUES ('UserA') RETURNING userid INTO userA_id;
    INSERT INTO users (username) VALUES ('UserB') RETURNING userid INTO userB_id;

    -- Dummy Thread Data
    -- Insert threads for UserA and get their thread IDs
    INSERT INTO threads (Name, userid) VALUES ('Thread1_UserA', userA_id) RETURNING threadid INTO thread1_userA_id;
    INSERT INTO threads (Name, userid) VALUES ('Thread2_UserA', userA_id) RETURNING threadid INTO thread2_userA_id;

    -- Insert threads for UserB and get their thread IDs
    INSERT INTO threads (Name, userid) VALUES ('Thread1_UserB', userB_id) RETURNING threadid INTO thread1_userB_id;
    INSERT INTO threads (Name, userid) VALUES ('Thread2_UserB', userB_id) RETURNING threadid INTO thread2_userB_id;

    -- Dummy Message Data
    -- Insert messages for Thread1_UserA
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userA_id, userA_id, 'Message1_Thread1_UserA', CURRENT_TIMESTAMP, TRUE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userA_id, userA_id, 'Message2_Thread1_UserA', CURRENT_TIMESTAMP, FALSE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userA_id, userA_id, 'Message3_Thread1_UserA', CURRENT_TIMESTAMP, TRUE);

    -- Insert messages for Thread2_UserA
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userA_id, userA_id, 'Message1_Thread2_UserA', CURRENT_TIMESTAMP, TRUE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userA_id, userA_id, 'Message2_Thread2_UserA', CURRENT_TIMESTAMP, FALSE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userA_id, userA_id, 'Message3_Thread2_UserA', CURRENT_TIMESTAMP, TRUE);

    -- Insert messages for Thread1_UserB
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userB_id, userB_id, 'Message1_Thread1_UserB', CURRENT_TIMESTAMP, TRUE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userB_id, userB_id, 'Message2_Thread1_UserB', CURRENT_TIMESTAMP, FALSE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread1_userB_id, userB_id, 'Message3_Thread1_UserB', CURRENT_TIMESTAMP, TRUE);

    -- Insert messages for Thread2_UserB
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userB_id, userB_id, 'Message1_Thread2_UserB', CURRENT_TIMESTAMP, TRUE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userB_id, userB_id, 'Message2_Thread2_UserB', CURRENT_TIMESTAMP, FALSE);
    INSERT INTO messages (threadid, userid, Text, Timestamp, sentbyuser) 
    VALUES (thread2_userB_id, userB_id, 'Message3_Thread2_UserB', CURRENT_TIMESTAMP, TRUE);
END $$;