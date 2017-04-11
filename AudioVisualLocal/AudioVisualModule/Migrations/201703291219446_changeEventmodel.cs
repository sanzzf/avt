namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "UserEmail", c => c.String());
            DropColumn("dbo.Events", "UserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "UserId", c => c.String());
            DropColumn("dbo.Events", "UserEmail");
        }
    }
}
