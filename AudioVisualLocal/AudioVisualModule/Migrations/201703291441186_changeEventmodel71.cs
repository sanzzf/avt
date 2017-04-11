namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel71 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "UserEmail", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Events", "UserEmail", c => c.String());
        }
    }
}
