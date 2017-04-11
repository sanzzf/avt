namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeuseridfromevent : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Events", "UserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "UserId", c => c.String());
        }
    }
}
